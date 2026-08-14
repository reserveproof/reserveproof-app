import { ReserveProofClient } from '@reserveproof/sdk';

export function getContractConfig() {
  const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID;
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE;

  if (!contractId || !rpcUrl || !networkPassphrase) {
    throw new Error(
      'Missing contract configuration: NEXT_PUBLIC_CONTRACT_ID, NEXT_PUBLIC_RPC_URL, and NEXT_PUBLIC_NETWORK_PASSPHRASE must be set'
    );
  }

  return { contractId, rpcUrl, networkPassphrase };
}

/**
 * Server-side, read-only client for simulated (non-signing) contract calls.
 * Uses INDEXER_SOURCE_PUBLIC_KEY as the simulation source account -- any
 * funded testnet account works, since none of these calls require auth.
 */
export function getReadOnlyClient(): ReserveProofClient {
  const { contractId, rpcUrl, networkPassphrase } = getContractConfig();
  const publicKey = process.env.INDEXER_SOURCE_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error('INDEXER_SOURCE_PUBLIC_KEY must be set to make read-only contract calls');
  }

  return new ReserveProofClient({ contractId, rpcUrl, networkPassphrase, publicKey });
}
