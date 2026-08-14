export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Live reserve attestations and issuer status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Issuers</h3>
          <p className="text-3xl font-bold">-</p>
          <p className="text-xs text-gray-500 mt-2">Registered on contract</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Healthy</h3>
          <p className="text-3xl font-bold text-green-600">-</p>
          <p className="text-xs text-gray-500 mt-2">Current attestations</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Stale</h3>
          <p className="text-3xl font-bold text-red-600">-</p>
          <p className="text-xs text-gray-500 mt-2">Exceeded window</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Attestations</h2>
        <div className="text-gray-500 text-center py-8">
          <p>Loading attestations from indexer...</p>
          <p className="text-sm mt-2">Phase 4: Indexer integration pending</p>
        </div>
      </div>
    </div>
  );
}
