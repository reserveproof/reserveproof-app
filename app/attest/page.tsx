'use client';

import { useState } from 'react';
import { useWallet } from '../providers';

export default function AttestationPage() {
  const { user, isConnected } = useWallet();
  const [mode, setMode] = useState<'submit' | 'cosign'>('submit');
  const [issuer, setIssuer] = useState('');
  const [reserveBalance, setReserveBalance] = useState('');
  const [outstandingSupply, setOutstandingSupply] = useState('');
  const [attestationId, setAttestationId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-semibold mb-4">Attestation Submission</h1>
        <div className="bg-amber-tint border border-line rounded-md p-6 text-amber-ink text-sm">
          Please connect your wallet to submit or co-sign attestations.
        </div>
      </div>
    );
  }

  const handleSubmitAttestation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // TODO: Call contract.submit_attestation() via SDK
      // For now, show UI only
      console.log('Submitting attestation:', {
        issuer,
        reserveBalance,
        outstandingSupply,
        signer: user?.publicKey,
      });
      setMessage('success:Attestation submitted (Phase 4: integration pending)');
    } catch (error) {
      setMessage(`error:${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // TODO: Call contract.co_sign_attestation() via SDK
      console.log('Co-signing attestation:', {
        attestationId,
        signer: user?.publicKey,
      });
      setMessage('success:Attestation co-signed (Phase 4: integration pending)');
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
        <span className="text-xs font-semibold uppercase tracking-wider text-forest">Attestor workspace</span>
        <h1 className="font-display text-3xl font-semibold mt-2">Attestation Submission</h1>
        <p className="text-ink-muted mt-2">Submit a new reserve attestation, or co-sign one awaiting your signature.</p>
      </div>

      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setMode('submit')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            mode === 'submit'
              ? 'border-forest text-forest'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          Submit Attestation
        </button>
        <button
          onClick={() => setMode('cosign')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            mode === 'cosign'
              ? 'border-forest text-forest'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          Co-Sign Attestation
        </button>
      </div>

      <form
        onSubmit={mode === 'submit' ? handleSubmitAttestation : handleCoSign}
        className="bg-surface border border-line rounded-lg p-6 shadow-card space-y-5"
      >
        {mode === 'submit' ? (
          <>
            <div>
              <label className={labelClass}>Issuer Address</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="G..."
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Reserve Balance</label>
              <input
                type="number"
                value={reserveBalance}
                onChange={(e) => setReserveBalance(e.target.value)}
                placeholder="1000000.00"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Outstanding Supply</label>
              <input
                type="number"
                value={outstandingSupply}
                onChange={(e) => setOutstandingSupply(e.target.value)}
                placeholder="1000000.00"
                className={inputClass}
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className={labelClass}>Attestation ID</label>
            <input
              type="text"
              value={attestationId}
              onChange={(e) => setAttestationId(e.target.value)}
              placeholder="0x..."
              className={inputClass}
              required
            />
          </div>
        )}

        <div className="bg-surface-2 border border-line rounded-sm p-3.5">
          <p className="text-sm text-ink-muted">
            Signer: <span className="font-medium text-ink tabular-nums">{user?.publicKey?.slice(0, 12)}...</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2.5 bg-amber text-white rounded-sm font-semibold hover:bg-amber-deep disabled:bg-ink-faint disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Processing…' : mode === 'submit' ? 'Submit Attestation' : 'Co-Sign Attestation'}
        </button>
      </form>

      {message && (
        <div
          className={`p-4 rounded-md text-sm font-medium ${
            isSuccess ? 'bg-success-tint text-success' : 'bg-danger-tint text-danger'
          }`}
        >
          {isSuccess ? '✓ ' : '⚠ '}
          {messageText}
        </div>
      )}
    </div>
  );
}
