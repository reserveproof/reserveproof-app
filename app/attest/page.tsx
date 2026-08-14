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
        <h1 className="text-3xl font-bold mb-4">Attestation Submission</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
          Please connect your wallet to submit or co-sign attestations
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
      setMessage('✅ Attestation submitted (Phase 4: integration pending)');
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      setMessage('✅ Attestation co-signed (Phase 4: integration pending)');
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Attestation Submission</h1>
        <p className="text-gray-600">Submit or co-sign reserve attestations</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setMode('submit')}
          className={`px-4 py-2 font-medium border-b-2 ${
            mode === 'submit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Submit Attestation
        </button>
        <button
          onClick={() => setMode('cosign')}
          className={`px-4 py-2 font-medium border-b-2 ${
            mode === 'cosign'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Co-Sign Attestation
        </button>
      </div>

      <form onSubmit={mode === 'submit' ? handleSubmitAttestation : handleCoSign} className="space-y-4">
        {mode === 'submit' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Address</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="G..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reserve Balance</label>
              <input
                type="number"
                value={reserveBalance}
                onChange={(e) => setReserveBalance(e.target.value)}
                placeholder="1000000.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Supply</label>
              <input
                type="number"
                value={outstandingSupply}
                onChange={(e) => setOutstandingSupply(e.target.value)}
                placeholder="1000000.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attestation ID</label>
            <input
              type="text"
              value={attestationId}
              onChange={(e) => setAttestationId(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Signer: {user?.publicKey?.slice(0, 12)}...</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? 'Processing...' : mode === 'submit' ? 'Submit Attestation' : 'Co-Sign Attestation'}
        </button>
      </form>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
