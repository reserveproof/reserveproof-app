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
        <h1 className="font-display text-3xl font-semibold mb-4">Admin Console</h1>
        <div className="bg-amber-tint border border-line rounded-md p-6 text-amber-ink text-sm">
          Admin access requires a connected wallet.
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

      setMessage('success:Issuer registered (Phase 4: contract integration pending)');
      setFormData({
        issuerAddress: '',
        name: '',
        assetAddress: '',
        windowSeconds: '86400',
        requiredAttestors: '',
        minSigners: '1',
      });
    } catch (error) {
      setMessage(`error:${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isSuccess = message.startsWith('success:');
  const messageText = message.replace(/^(success|error):/, '');

  const inputClass =
    'w-full px-3.5 py-2.5 text-[15px] border border-line-strong rounded-sm bg-surface text-ink placeholder:text-ink-faint focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest-tint transition-shadow';
  const labelClass = 'block text-sm font-semibold text-ink mb-1.5';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-forest">Registry administration</span>
        <h1 className="font-display text-3xl font-semibold mt-2">Admin Console</h1>
        <p className="text-ink-muted mt-2">Register and manage issuers on the ReserveProof contract.</p>
      </div>

      <div className="bg-surface border border-line rounded-lg p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold mb-5">Register New Issuer</h2>
        <form onSubmit={handleRegisterIssuer} className="space-y-5">
          <div>
            <label className={labelClass}>Issuer Address</label>
            <input
              type="text"
              value={formData.issuerAddress}
              onChange={(e) => setFormData({ ...formData, issuerAddress: e.target.value })}
              placeholder="G..."
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Issuer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Stellar USDC"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Asset Address</label>
            <input
              type="text"
              value={formData.assetAddress}
              onChange={(e) => setFormData({ ...formData, assetAddress: e.target.value })}
              placeholder="G..."
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Attestation Window (seconds)</label>
            <input
              type="number"
              value={formData.windowSeconds}
              onChange={(e) => setFormData({ ...formData, windowSeconds: e.target.value })}
              placeholder="86400"
              className={inputClass}
              required
            />
            <p className="text-xs text-ink-faint mt-1.5">Default: 86400 (1 day)</p>
          </div>

          <div>
            <label className={labelClass}>Required Attestors (comma-separated)</label>
            <textarea
              value={formData.requiredAttestors}
              onChange={(e) => setFormData({ ...formData, requiredAttestors: e.target.value })}
              placeholder="G..., G..., G..."
              className={`${inputClass} min-h-[84px] resize-y`}
              rows={3}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Minimum Signers</label>
            <input
              type="number"
              value={formData.minSigners}
              onChange={(e) => setFormData({ ...formData, minSigners: e.target.value })}
              placeholder="1"
              min="1"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-amber text-white rounded-sm font-semibold hover:bg-amber-deep disabled:bg-ink-faint disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Registering…' : 'Register Issuer'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 p-4 rounded-md text-sm font-medium ${
              isSuccess ? 'bg-success-tint text-success' : 'bg-danger-tint text-danger'
            }`}
          >
            {isSuccess ? '✓ ' : '⚠ '}
            {messageText}
          </div>
        )}
      </div>
    </div>
  );
}
