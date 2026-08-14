'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';

export interface User {
  publicKey: string;
  role: 'admin' | 'issuer' | 'attestor' | 'public';
}

interface WalletContextType {
  user: User | null;
  isConnected: boolean;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">🔐 ReserveProof</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">Dashboard</a>
              <a href="/issuers" className="text-sm font-medium text-gray-700 hover:text-gray-900">Issuers</a>
              <a href="/attest" className="text-sm font-medium text-gray-700 hover:text-gray-900">Attest</a>
              <a href="/admin" className="text-sm font-medium text-gray-700 hover:text-gray-900">Admin</a>
            </nav>
            <WalletButton />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </WalletProvider>
  );
}

function WalletProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setError(null);
      // TODO: Implement wallet connection via Stellar Wallets Kit
      // For now, simulate with random keypair
      const keypair = Keypair.random();
      setUser({
        publicKey: keypair.publicKey(),
        role: 'public',
      });
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider value={{ user, isConnected, login, logout, error }}>
      {children}
    </WalletContext.Provider>
  );
}

function WalletButton() {
  const context = useContext(WalletContext);
  if (!context) return null;

  const { user, isConnected, login, logout } = context;

  if (isConnected && user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user.publicKey.slice(0, 6)}...</span>
        <button
          onClick={logout}
          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 rounded hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
