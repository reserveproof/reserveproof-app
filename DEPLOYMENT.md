# Deployment Guide: ReserveProof App

This guide covers deploying the ReserveProof web application to production environments.

## Prerequisites

1. **Node.js & npm**
   ```bash
   node --version  # v18+
   npm --version   # v9+
   ```

2. **PostgreSQL Database**
   - Local: `brew install postgresql` (macOS) or Docker
   - Hosted: Supabase, AWS RDS, Google Cloud SQL
   - Connection string format: `postgresql://user:password@host:port/dbname`

3. **Stellar Testnet Account** (for testing)
   - Fund account: https://stellar.org/laboratory
   - Get test keypair

4. **Deployment Platform Account**
   - Vercel (recommended for Next.js)
   - AWS, Google Cloud, Azure, or self-hosted

## Local Development Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment
NEXT_PUBLIC_CONTRACT_ID=CAB3UJF...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://localhost/reserveproof_dev

# Setup database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

## Vercel Deployment (Recommended)

### Step 1: Connect Repository

1. Go to https://vercel.com/new
2. Select "Next.js" project type
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_CONTRACT_ID=CAB3UJF...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://user:pass@host:5432/dbname
INDEXER_INTERVAL_MS=30000
```

**Security note:** Database credentials are marked as private (not exposed to client).

### Step 3: Configure Database

1. Create PostgreSQL database:
   - Supabase: https://supabase.com (Free tier available)
   - AWS RDS: Create PostgreSQL instance
   - Self-hosted: PostgreSQL server

2. Get connection string and add to environment variables

3. Run migrations:
   ```bash
   vercel env pull  # Get env from Vercel
   npx prisma migrate deploy  # Apply migrations
   ```

### Step 4: Deploy

```bash
# First deployment (auto on GitHub push)
git push origin main

# Manual deployment
vercel deploy --prod
```

### Step 5: Verify Deployment

1. Check deployment status: https://vercel.com/dashboard
2. Visit app URL: `https://your-app.vercel.app`
3. Test wallet connection (use testnet account)
4. Submit test attestation

## Self-Hosted Deployment (Docker)

### Step 1: Build Docker Image

```bash
docker build -t reserveproof-app .
```

### Step 2: Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_CONTRACT_ID=CAB3UJF... \
  -e NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org \
  -e DATABASE_URL=postgresql://... \
  --name reserveproof \
  reserveproof-app
```

### Step 3: Database Setup

```bash
docker-compose up -d db
docker-compose run web npx prisma migrate deploy
docker-compose up -d web
```

## Production Checklist

Before deploying to production (mainnet):

### Security
- [ ] Environment variables configured (no secrets in code)
- [ ] Database credentials secured
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] No debug mode enabled
- [ ] Logging configured (no sensitive data)

### Database
- [ ] Migrations tested
- [ ] Backups configured (daily minimum)
- [ ] Connection pooling configured
- [ ] Read replicas setup (optional, for scale)

### Monitoring
- [ ] Error tracking enabled (Sentry, DataDog, etc.)
- [ ] Performance monitoring enabled (Web Vitals)
- [ ] Uptime monitoring configured
- [ ] Alerts configured for failures

### Testing
- [ ] All tests passing
- [ ] E2E tests run successfully
- [ ] Wallet integration tested
- [ ] API routes tested with edge cases
- [ ] Indexer worker tested

### Operations
- [ ] Runbooks created
- [ ] Incident response procedure documented
- [ ] Team trained on deployment
- [ ] Rollback procedure tested
- [ ] DNS configured
- [ ] SSL certificate setup
- [ ] WAF (Web Application Firewall) configured

## Environment Configuration

### Development

```env
NEXT_PUBLIC_CONTRACT_ID=CAB3UJF...  # Testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://localhost/reserveproof_dev
NODE_ENV=development
```

### Staging

```env
NEXT_PUBLIC_CONTRACT_ID=CCAB3...    # Testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://staging-db/reserveproof
NODE_ENV=production
```

### Production

```env
NEXT_PUBLIC_CONTRACT_ID=CPROD...    # Mainnet
NEXT_PUBLIC_RPC_URL=https://soroban-mainnet.stellar.org
DATABASE_URL=postgresql://prod-db/reserveproof
NODE_ENV=production
```

## Scaling Considerations

### Database
- Connection pooling (PgBouncer): 100-200 connections
- Read replicas for read-heavy workloads
- Backup retention: 30 days minimum
- Regular vacuum and analyze

### Application
- Horizontal scaling: Multiple app instances
- Load balancer (Vercel handles automatically)
- CDN for static assets (Vercel handles automatically)
- Worker processes for background jobs (indexer)

### RPC Endpoint
- Rate limit: Check Stellar documentation
- Fallback endpoints for redundancy
- Consider running local Soroban RPC (for high load)

## Monitoring & Alerting

### Application Metrics
- Request latency
- Error rate
- Database query performance
- Worker process health

### Business Metrics
- Attestations submitted
- Issuers registered
- Average reserve ratio
- Transaction volume

### Alerts to Configure
- High error rate (>1%)
- Database connection failures
- Worker process stuck
- RPC endpoint down
- Deployment failures

## Troubleshooting

### Issue: Database connection fails
- Verify DATABASE_URL format
- Check database is running and accessible
- Verify credentials are correct
- Check network firewall rules

### Issue: Wallet connection fails
- Verify RPC URL is correct
- Check Stellar network is operational
- Verify contract is deployed on selected network
- Check wallet browser extension

### Issue: Slow API responses
- Check database query performance
- Monitor RPC endpoint latency
- Check application logs for errors
- Scale application horizontally if needed

### Issue: Worker/indexer stuck
- Check worker logs
- Verify RPC endpoint connectivity
- Restart worker process
- Check database for locks

## Rollback Procedure

If production deployment has critical issues:

```bash
# Vercel: Automatic rollback
vercel rollback

# Manual rollback to previous deployment
vercel deploy --prod [DEPLOYMENT_ID]

# Database rollback (if migration issue)
npx prisma migrate resolve --rolled-back "migration_name"
```

## Support

For deployment questions or issues:
- GitHub Issues: https://github.com/reserveproof/reserveproof-app/issues
- Email: support@reserveproof.dev
- Documentation: https://docs.reserveproof.dev
