export default function IssuersDirectory() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest">Public directory</span>
        <h1 className="font-display text-3xl font-semibold mt-2">Issuers</h1>
        <p className="text-ink-muted mt-2">Every registered issuer and its current reserve ratio, in one place.</p>
      </div>

      <div className="bg-surface border border-line rounded-lg overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-surface-2 border-b border-line">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">Issuer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-faint">Reserve Ratio</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-faint">Last Attestation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink-muted">
                  <div>Loading issuers from contract&hellip;</div>
                  <p className="text-sm mt-2 text-ink-faint">Phase 4: Contract indexer integration pending</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
