-- CreateTable
CREATE TABLE "Issuer" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetAddress" TEXT NOT NULL,
    "attestationWindowSeconds" INTEGER NOT NULL,
    "minSigners" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssuerAttestor" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "attestor" TEXT NOT NULL,

    CONSTRAINT "IssuerAttestor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "reserveBalance" BIGINT NOT NULL,
    "outstandingSupply" BIGINT NOT NULL,
    "supportingDocHash" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Pending',
    "submittedAt" INTEGER NOT NULL,
    "finalizedAt" INTEGER,
    "signerCount" INTEGER NOT NULL DEFAULT 0,
    "ledgerSequence" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttestationSigner" (
    "id" TEXT NOT NULL,
    "attestationId" TEXT NOT NULL,
    "signer" TEXT NOT NULL,
    "signedAt" INTEGER NOT NULL,

    CONSTRAINT "AttestationSigner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StalenessFlagEvent" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "flaggedAt" INTEGER NOT NULL,
    "flaggedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StalenessFlagEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexerCursor" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "pagingToken" TEXT,
    "lastLedger" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexerCursor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_address_key" ON "Issuer"("address");

-- CreateIndex
CREATE UNIQUE INDEX "IssuerAttestor_issuerId_attestor_key" ON "IssuerAttestor"("issuerId", "attestor");

-- CreateIndex
CREATE INDEX "Attestation_issuerId_idx" ON "Attestation"("issuerId");

-- CreateIndex
CREATE INDEX "Attestation_state_idx" ON "Attestation"("state");

-- CreateIndex
CREATE INDEX "Attestation_finalizedAt_idx" ON "Attestation"("finalizedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AttestationSigner_attestationId_signer_key" ON "AttestationSigner"("attestationId", "signer");

-- CreateIndex
CREATE INDEX "StalenessFlagEvent_issuerId_idx" ON "StalenessFlagEvent"("issuerId");

-- AddForeignKey
ALTER TABLE "IssuerAttestor" ADD CONSTRAINT "IssuerAttestor_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttestationSigner" ADD CONSTRAINT "AttestationSigner_attestationId_fkey" FOREIGN KEY ("attestationId") REFERENCES "Attestation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
