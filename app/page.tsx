export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest">Live network status</span>
        <h1 className="font-display text-3xl font-semibold mt-2">Dashboard</h1>
        <p className="text-ink-muted mt-2">Live reserve attestations and issuer status across the registry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-line rounded-lg p-6 shadow-card">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Total Issuers</h3>
          <p className="font-display text-3xl font-semibold mt-2 tabular-nums">&mdash;</p>
          <p className="text-xs text-ink-faint mt-2">Registered on contract</p>
        </div>

        <div className="bg-surface border border-line rounded-lg p-6 shadow-card">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Healthy</h3>
          <p className="font-display text-3xl font-semibold mt-2 tabular-nums text-success">&mdash;</p>
          <p className="text-xs text-ink-faint mt-2">Current attestations</p>
        </div>

        <div className="bg-surface border border-line rounded-lg p-6 shadow-card">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Stale</h3>
          <p className="font-display text-3xl font-semibold mt-2 tabular-nums text-danger">&mdash;</p>
          <p className="text-xs text-ink-faint mt-2">Exceeded attestation window</p>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-lg p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold mb-4">Recent Attestations</h2>
        <div className="text-ink-muted text-center py-10">
          <p>Loading attestations from indexer&hellip;</p>
          <p className="text-sm mt-2 text-ink-faint">Phase 4: Indexer integration pending</p>
        </div>
      </div>
    </div>
  );
}
