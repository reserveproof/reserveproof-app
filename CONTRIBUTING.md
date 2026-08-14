# Contributing to ReserveProof App

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for local indexer development)

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ID=CXXXXX...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
DATABASE_URL=postgresql://user:password@localhost:5432/reserveproof
```

### Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Code Style

- Format with Prettier: `npm run format`
- Type check: `npm run type-check`
- Lint: `npm run lint`

## Commits

This project follows Conventional Commits:
- `feat(app): add issuer directory page`
- `fix(app): correct reserve ratio display`
- `test(app): add wallet auth tests`

Each commit should be focused and leave the code in a working, tested state. Push after every commit.

## Pull Requests

- One discrete piece of work per PR
- Reference related issues
- Include brief description of changes and rationale
- Ensure CI passes (npm run type-check + npm run build)

## Testing

UI components should have corresponding tests (setup details in Phase 4+).

## Accessibility

- Use semantic HTML
- Ensure sufficient color contrast
- Test keyboard navigation
- Use ARIA labels where needed

## Documentation

Update relevant docs when adding new features:
- Update README if user-facing
- Add comments for non-obvious logic (avoid explaining WHAT the code does)
