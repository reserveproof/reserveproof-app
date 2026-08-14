# Security Model: ReserveProof App

This document outlines security best practices and threat model for the ReserveProof web application.

## Environment Variables & Secrets

### Configuration

All sensitive configuration must be provided via environment variables, never hardcoded:

```bash
# Required
NEXT_PUBLIC_CONTRACT_ID=CAB3UJF...          # Public - contract address
NEXT_PUBLIC_RPC_URL=https://soroban-...     # Public - RPC endpoint
DATABASE_URL=postgresql://...               # Private - database connection

# Optional
INDEXER_INTERVAL_MS=30000                   # Public - indexer polling interval
NEXT_PUBLIC_NETWORK=testnet                 # Public - network identifier
```

### Secret Protection

**Never commit:**
- `.env` or `.env.local` files
- Database credentials
- API keys or tokens
- Private encryption keys
- Wallet private keys

**Always use:**
- Environment variables for secrets
- `.env.example` with placeholders
- `.gitignore` to exclude `.env*`
- Secrets management system (Vercel, AWS Secrets Manager, etc.)

## Authentication & Authorization

### Wallet-Based Authentication

The app uses Stellar wallet extensions for authentication:
- No passwords stored in database
- Wallet extension manages private keys (never exposed to app)
- User authenticated via signed transaction

### Access Control

**Public pages:**
- Home/Dashboard
- Issuer list
- Reserve ratios (read-only)

**Admin-only pages:**
- Admin panel (`/admin`)
- Issuer registration
- Admin controls

### Implementation

Admin routes protected by server-side auth check:
```typescript
// app/admin/page.tsx
export default async function AdminPage() {
  const user = await getUser();
  if (!isAdmin(user)) {
    redirect('/');
  }
  return <AdminContent />;
}
```

**Never rely on client-side checks alone.** Client-side checks can be bypassed.

## Database Security

### Connection

- PostgreSQL connection via secured connection string
- All queries use parameterized statements (Prisma prevents SQL injection)
- Connection pooling configured for performance

### Credentials

- DATABASE_URL never exposed to client
- Database credentials in environment variables only
- Different credentials for dev/staging/prod
- Regular credential rotation recommended

### Migrations

- Migrations tracked in git (`prisma/migrations/`)
- Applied automatically on deployment
- Tested before production deployment
- Rollback procedures documented

### Data Protection

- No PII (Personally Identifiable Information) stored
- Issuer data is public blockchain data
- No sensitive logs written to database
- Regular database backups maintained

## API Routes Security

### Input Validation

All API routes validate user input:

```typescript
// app/api/attestation/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  
  // Validate input
  if (!isValidAddress(body.issuer)) {
    return Response.json({ error: 'Invalid issuer' }, { status: 400 });
  }
  if (body.balance < 0) {
    return Response.json({ error: 'Invalid balance' }, { status: 400 });
  }
  
  // Process...
}
```

### Error Handling

Error responses don't leak sensitive information:

```typescript
// Safe - generic error message
return Response.json({ error: 'Processing failed' }, { status: 500 });

// Unsafe - exposes internal details
return Response.json({ error: error.message }, { status: 500 });
```

## Content Security Policy (CSP)

Headers configured in `next.config.js`:

```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // Required for Next.js
    "style-src 'self' 'unsafe-inline'",   // Required for Tailwind
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://soroban-testnet.stellar.org",  // RPC endpoint
  ].join('; ')
}
```

## Wallet Integration Security

### Wallet Providers

Supported wallets via Stellar Wallets Kit:
- Freighter
- xBull
- Lobstr

### Security Guarantees

- No private keys transmitted to app
- User approval required for each transaction
- Wallet extension controls all signing
- Transaction validation before signing
- Network verification before signing

### Implementation

```typescript
// Never request private keys
const signer = new WalletSigner(wallet);
// Wallet controls signing, not the app
await signer.signTransaction(tx);
```

## Frontend Security

### XSS Prevention

- React auto-escapes JSDoc content (default safe)
- Never use `dangerouslySetInnerHTML`
- Never use `bypassSecurityTrustHtml`
- Sanitize all user-provided content
- CSP headers prevent inline script injection

### CSRF Prevention

- Token-based CSRF protection for state-changing requests
- SameSite cookie attribute set to 'Strict'
- Wallet signing prevents traditional CSRF

### Dependency Security

- Dependencies regularly audited (`npm audit`)
- Lock file committed to ensure reproducible builds
- No installation from untrusted registries
- Version pinning for critical dependencies

## Data Transmission

### HTTPS Only

- All connections use HTTPS
- HSTS header enforces secure connections
- No HTTP fallback
- API calls to RPC endpoints via HTTPS only

### Rate Limiting

- API routes should implement rate limiting
- Database query limits (Prisma connection pooling)
- RPC endpoint rate limits respected

## Logging & Monitoring

### Safe Logging

Logs must NOT contain:
- Private keys or seed phrases
- Database credentials
- API keys or tokens
- User PII (email, phone, full addresses)
- Full error stack traces with paths

### Logging Framework

```typescript
// Safe
logger.info('Attestation submitted', { issuer, transactionId });

// Unsafe
logger.info('Attestation submitted', { issuer, transaction });
logger.error(error);  // May contain sensitive stack trace
```

### Monitoring Alerts

Monitor for:
- Unusual API request patterns
- Database connection failures
- Failed wallet authentications
- Contract call errors
- RPC endpoint failures

## Deployment Security

### Environment Isolation

- Separate environments: dev, staging, production
- Different database for each environment
- Different RPC endpoints (testnet vs mainnet)
- Different credentials per environment

### Secrets Management

Use production secrets manager:
- **Vercel:** Environment variables in project settings
- **AWS:** AWS Secrets Manager
- **GCP:** Google Cloud Secret Manager
- **Azure:** Azure Key Vault

Never use `.env` file in production.

### Build Security

- Build artifacts never contain secrets
- `NEXT_PUBLIC_*` variables shown in bundle (safe)
- Other secrets removed at build time
- Source maps disabled in production

## Deployment Checklist

Before production deployment:

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Wallet integration tested with real wallet
- [ ] API routes tested with valid/invalid inputs
- [ ] Rate limiting configured
- [ ] Logging configured (no sensitive data)
- [ ] CSP headers verified
- [ ] HTTPS enforced
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Incident response procedure documented
- [ ] Team security training completed

## Threat Model

### Protected Against

- Unauthorized wallet access (via Stellar auth)
- SQL injection (via Prisma ORM)
- XSS attacks (via React auto-escaping + CSP)
- CSRF attacks (via token + SameSite cookies)
- Man-in-the-middle (via HTTPS + HSTS)
- Credential exposure (via environment variables)

### Not Protected Against

- Compromised wallet (user responsibility)
- Leaked private keys (user responsibility)
- Weak database passwords (operations responsibility)
- Physical server compromise (hosting provider responsibility)
- Social engineering (user responsibility)

## Security Updates

If a vulnerability is discovered:

1. Email security@reserveproof.dev
2. Include vulnerability details
3. Do not open public GitHub issues
4. Patch will be released as soon as possible

## Compliance

- No PII storage or processing
- Public data only (blockchain data)
- Standard security headers
- Secure by default (HTTPS, CSP, etc.)
- Follows OWASP Top 10 best practices

## Support

For security questions or concerns:
- GitHub Issues: https://github.com/reserveproof/reserveproof-app/issues
- Email: security@reserveproof.dev
- Documentation: https://docs.reserveproof.dev
