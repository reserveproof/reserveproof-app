# ReserveProof App

Public dashboard for ReserveProof on-chain proof-of-reserves attestations.

## Overview

ReserveProof App is a Next.js web application that provides:

- **Public Dashboard**: Overview of all registered issuers, reserve ratios, and staleness status
- **Issuer Directory**: Browse individual issuer details, attestation history, and reserve-over-time charts
- **Attestor Interface**: Submit and co-sign attestations for registered issuers
- **Admin Console**: Register issuers, configure attestor sets, and manage the registry
- **Audit Export**: Export attestation history in CSV/JSON format

## Legal Disclaimer

ReserveProof is a transparency and verification tool, not a substitute for a licensed, independent financial audit. It's designed to complement traditional audits with continuous, machine-verifiable attestations between audit cycles. This is not legal or financial advice — issuers should confirm what satisfies their jurisdiction's reserve-reporting requirements with qualified counsel.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```
NEXT_PUBLIC_CONTRACT_ID=CXXXXX...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
DATABASE_URL=postgresql://user:password@localhost:5432/reserveproof
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build & Deploy

```bash
npm run build
npm start
```

## Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Wallet Auth**: Stellar Wallets Kit (Freighter, xBull, Lobstr)
- **Database**: PostgreSQL via Prisma (for indexing contract events)
- **Blockchain**: Reads from Soroban contract via RPC, writes via wallet-signed transactions

## Pages

- `/dashboard` — Overview dashboard (public)
- `/issuers` — Directory of all issuers (public)
- `/issuers/[id]` — Issuer detail page with chart history (public)
- `/attest` — Submit/co-sign attestations (attestor only)
- `/admin` — Issuer registration and configuration (admin only)
- `/audit` — Attestation history export (public)
- `/settings` — User profile and role management (authenticated)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License — see [LICENSE](LICENSE)
