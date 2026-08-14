export default function IssuersDirectory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Issuers</h1>
        <p className="text-gray-600">Public directory of all registered issuers and their reserve ratios</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Issuer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Asset</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Reserve Ratio</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Last Attestation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                <div>Loading issuers from contract...</div>
                <p className="text-sm mt-2">Phase 4: Contract indexer integration pending</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
