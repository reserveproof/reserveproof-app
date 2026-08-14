'use client';

import { useState } from 'react';
import { useWallet } from '../providers';

export default function AdminPage() {
  const { user, isConnected } = useWallet();
  const [formData, setFormData] = useState({
    issuerAddress: '',
    name: '',
    assetAddress: '',
    windowSeconds: '86400',
    requiredAttestors: '',
    minSigners: '1',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Console</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
          Admin access requires wallet connection
        </div>
      </div>
    );
  }

  const handleRegisterIssuer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // TODO: Call contract.register_issuer() via SDK
      // Requires admin auth check first
      const attestorsArray = formData.requiredAttestors
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      console.log('Registering issuer:', {
        ...formData,
        requiredAttestors: attestorsArray,
        admin: user?.publicKey,
      });

      setMessage('✅ Issuer registered (Phase 4: contract integration pending)');
      setFormData({
        issuerAddress: '',
        name: '',
        assetAddress: '',
        windowSeconds: '86400',
        requiredAttestors: '',
        minSigners: '1',
      });
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Console</h1>
        <p className="text-gray-600">Register and manage issuers</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Register New Issuer</h2>
        <form onSubmit={handleRegisterIssuer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Address</label>
            <input
              type="text"
              value={formData.issuerAddress}
              onChange={(e) => setFormData({ ...formData, issuerAddress: e.target.value })}
              placeholder="G..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Stellar USDC"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Address</label>
            <input
              type="text"
              value={formData.assetAddress}
              onChange={(e) => setFormData({ ...formData, assetAddress: e.target.value })}
              placeholder="G..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attestation Window (seconds)</label>
            <input
              type="number"
              value={formData.windowSeconds}
              onChange={(e) => setFormData({ ...formData, windowSeconds: e.target.value })}
              placeholder="86400"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Default: 86400 (1 day)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Attestors (comma-separated)</label>
            <textarea
              value={formData.requiredAttestors}
              onChange={(e) => setFormData({ ...formData, requiredAttestors: e.target.value })}
              placeholder="G..., G..., G..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Signers</label>
            <input
              type="number"
              value={formData.minSigners}
              onChange={(e) => setFormData({ ...formData, minSigners: e.target.value })}
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Registering...' : 'Register Issuer'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
