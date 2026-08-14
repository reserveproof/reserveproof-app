#!/usr/bin/env node

/**
 * ReserveProof Indexer Worker
 *
 * Polls the Soroban RPC `getEvents` endpoint for ReserveProofContract events
 * and syncs them into Postgres via Prisma, so the Next.js app can read
 * issuer/attestation state from a fast local DB instead of hitting the
 * chain on every page load.
 *
 * The contract does not expose a "list all issuers" or "list pending
 * attestations" read call, so events are the only way to discover them --
 * this worker is the source of truth for what the DB contains.
 *
 * Run with: npm run indexer
 */

import { Server } from '@stellar/stellar-sdk/rpc';
import { scValToNative } from '@stellar/stellar-sdk';
import { prisma } from '../lib/prisma';
import { getContractConfig, getReadOnlyClient } from '../lib/reserveproof';
import type { ReserveProofClient } from '@reserveproof/sdk';

const POLL_INTERVAL_MS = Number(process.env.INDEXER_INTERVAL_MS ?? 6000);
const PAGE_LIMIT = 1000;
const CURSOR_ID = 'main';

const TOPIC = {
  ISSUER_REGISTERED: 'iss_reg',
  ISSUER_UPDATED: 'iss_upd',
  ATTESTATION_SUBMITTED: 'submitted',
  ATTESTATION_COSIGNED: 'cosigned',
  ATTESTATION_FINALIZED: 'finalized',
  ISSUER_FLAGGED_STALE: 'stale',
} as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function bufferToHex(buf: Buffer | Uint8Array): string {
  return '0x' + Buffer.from(buf).toString('hex');
}

function eventTimestamp(event: { ledgerClosedAt: string }): number {
  return Math.floor(new Date(event.ledgerClosedAt).getTime() / 1000);
}

async function syncIssuer(client: ReserveProofClient, issuerAddress: string): Promise<void> {
  const issuer = await client.getIssuer(issuerAddress);
  if (!issuer) {
    console.warn(`[indexer] getIssuer(${issuerAddress}) returned null, skipping`);
    return;
  }

  await prisma.issuer.upsert({
    where: { id: issuerAddress },
    create: {
      id: issuerAddress,
      address: issuer.address,
      name: issuer.name,
      assetAddress: issuer.asset,
      attestationWindowSeconds: issuer.attestationWindowSeconds,
      minSigners: issuer.minSigners,
      status: issuer.status,
    },
    update: {
      name: issuer.name,
      assetAddress: issuer.asset,
      attestationWindowSeconds: issuer.attestationWindowSeconds,
      minSigners: issuer.minSigners,
      status: issuer.status,
    },
  });

  await prisma.issuerAttestor.deleteMany({ where: { issuerId: issuerAddress } });
  if (issuer.requiredAttestors.length > 0) {
    await prisma.issuerAttestor.createMany({
      data: issuer.requiredAttestors.map((attestor) => ({ issuerId: issuerAddress, attestor })),
      skipDuplicates: true,
    });
  }
}

async function syncAttestationCore(
  client: ReserveProofClient,
  attestationIdHex: string,
  event: { ledger: number; txHash: string }
) {
  const attestation = await client.getAttestation(attestationIdHex);
  if (!attestation) {
    console.warn(`[indexer] getAttestation(${attestationIdHex}) returned null, skipping`);
    return null;
  }

  const issuerExists = await prisma.issuer.findUnique({ where: { id: attestation.issuer } });
  if (!issuerExists) {
    await syncIssuer(client, attestation.issuer);
  }

  await prisma.attestation.upsert({
    where: { id: attestationIdHex },
    create: {
      id: attestationIdHex,
      issuerId: attestation.issuer,
      reserveBalance: attestation.reserveBalance,
      outstandingSupply: attestation.outstandingSupply,
      supportingDocHash: attestation.supportingDocHash,
      state: attestation.state,
      submittedAt: attestation.submittedAt,
      finalizedAt: attestation.finalizedAt ?? null,
      signerCount: attestation.signers.length,
      ledgerSequence: event.ledger,
      transactionHash: event.txHash,
    },
    update: {
      state: attestation.state,
      finalizedAt: attestation.finalizedAt ?? null,
      signerCount: attestation.signers.length,
      ledgerSequence: event.ledger,
      transactionHash: event.txHash,
    },
  });

  return attestation;
}

async function recordSigner(attestationIdHex: string, signer: string, signedAt: number): Promise<void> {
  await prisma.attestationSigner.upsert({
    where: { attestationId_signer: { attestationId: attestationIdHex, signer } },
    create: { attestationId: attestationIdHex, signer, signedAt },
    update: {},
  });
}

async function processEvent(event: any, client: ReserveProofClient): Promise<void> {
  const topic = scValToNative(event.topic[0]) as string;
  const value = scValToNative(event.value);

  switch (topic) {
    case TOPIC.ISSUER_REGISTERED:
    case TOPIC.ISSUER_UPDATED: {
      await syncIssuer(client, value as string);
      break;
    }

    case TOPIC.ATTESTATION_SUBMITTED: {
      const [, attestationIdBuf] = value as [string, Buffer];
      const attestationIdHex = bufferToHex(attestationIdBuf);
      const attestation = await syncAttestationCore(client, attestationIdHex, event);
      if (attestation && attestation.signers.length > 0) {
        await recordSigner(attestationIdHex, attestation.signers[0], eventTimestamp(event));
      }
      break;
    }

    case TOPIC.ATTESTATION_COSIGNED: {
      const [, attestationIdBuf, signer] = value as [string, Buffer, string];
      const attestationIdHex = bufferToHex(attestationIdBuf);
      await syncAttestationCore(client, attestationIdHex, event);
      await recordSigner(attestationIdHex, signer, eventTimestamp(event));
      break;
    }

    case TOPIC.ATTESTATION_FINALIZED: {
      const [, attestationIdBuf] = value as [string, Buffer];
      await syncAttestationCore(client, bufferToHex(attestationIdBuf), event);
      break;
    }

    case TOPIC.ISSUER_FLAGGED_STALE: {
      await prisma.stalenessFlagEvent.create({
        data: {
          issuerId: value as string,
          flaggedAt: eventTimestamp(event),
        },
      });
      break;
    }

    default:
      console.warn(`[indexer] Unknown event topic: ${topic}`);
  }
}

async function pollOnce(server: Server, client: ReserveProofClient, contractId: string): Promise<void> {
  const cursorRow = await prisma.indexerCursor.findUnique({ where: { id: CURSOR_ID } });

  const request: Parameters<Server['getEvents']>[0] = cursorRow?.pagingToken
    ? {
        filters: [{ type: 'contract', contractIds: [contractId] }],
        cursor: cursorRow.pagingToken,
        limit: PAGE_LIMIT,
      }
    : {
        filters: [{ type: 'contract', contractIds: [contractId] }],
        startLedger: Number(process.env.INDEXER_START_LEDGER ?? 0),
        limit: PAGE_LIMIT,
      };

  const response = await server.getEvents(request);

  for (const event of response.events) {
    await processEvent(event, client);
  }

  if (response.events.length > 0) {
    const last = response.events[response.events.length - 1];
    await prisma.indexerCursor.upsert({
      where: { id: CURSOR_ID },
      create: { id: CURSOR_ID, pagingToken: last.pagingToken, lastLedger: last.ledger },
      update: { pagingToken: last.pagingToken, lastLedger: last.ledger },
    });
    console.log(`[indexer] processed ${response.events.length} event(s), now at ledger ${last.ledger}`);
  }
}

async function main() {
  const { contractId, rpcUrl } = getContractConfig();
  const server = new Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
  const client = getReadOnlyClient();

  console.log(`[indexer] starting for contract ${contractId} via ${rpcUrl}`);
  console.log(`[indexer] poll interval: ${POLL_INTERVAL_MS}ms`);

  while (true) {
    try {
      await pollOnce(server, client, contractId);
    } catch (err) {
      console.error('[indexer] poll failed:', err instanceof Error ? err.message : err);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

main().catch((err) => {
  console.error('[indexer] fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
