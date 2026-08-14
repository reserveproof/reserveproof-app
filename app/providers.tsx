'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr';

export interface User {
  publicKey: string;
  role: 'admin' | 'issuer' | 'attestor' | 'public';
}

export interface WalletSigner {
  publicKey: string;
  signTransaction: (
    tx: string,
    opts?: { network?: string; networkPassphrase?: string; accountToSign?: string }
  ) => Promise<string>;
}

interface WalletContextType {
  user: User | null;
  isConnected: boolean;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
  /** A signer object compatible with ReserveProofClient's `signer` config, or null if not connected. */
  signer: WalletSigner | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ?? Networks.TESTNET;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-bg text-ink">
        <header className="sticky top-0 z-30 border-b border-line bg-surface px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-2.5 font-display font-semibold text-lg text-forest-deep">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 6.5V12L15.5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              ReserveProof
            </div>
            <nav className="flex gap-7">
              <a href="/" className="text-sm font-semibold text-ink-muted hover:text-forest transition-colors">Dashboard</a>
              <a href="/issuers" className="text-sm font-semibold text-ink-muted hover:text-forest transition-colors">Issuers</a>
              <a href="/attest" className="text-sm font-semibold text-ink-muted hover:text-forest transition-colors">Attest</a>
              <a href="/admin" className="text-sm font-semibold text-ink-muted hover:text-forest transition-colors">Admin</a>
            </nav>
            <WalletButton />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>
      </div>
    </WalletProvider>
  );
}

function makeSigner(publicKey: string): WalletSigner {
  return {
    publicKey,
    signTransaction: async (tx, opts) => {
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(tx, {
        networkPassphrase: opts?.networkPassphrase ?? NETWORK_PASSPHRASE,
        address: publicKey,
      });
      return signedTxXdr;
    },
  };
}

function WalletProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    StellarWalletsKit.init({
      modules: [new FreighterModule(), new xBullModule(), new LobstrModule()],
      network: NETWORK_PASSPHRASE as Networks,
    });

    // Restore a previously connected wallet, if the browser extension still reports one.
    StellarWalletsKit.getAddress()
      .then(({ address }) => {
        if (address) {
          setUser({ publicKey: address, role: 'public' });
          setIsConnected(true);
        }
      })
      .catch(() => {
        // No wallet connected yet -- nothing to restore.
      });
  }, []);

  const login = useCallback(async () => {
    try {
      setError(null);
      const { address } = await StellarWalletsKit.authModal();
      setUser({ publicKey: address, role: 'public' });
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, []);

  const logout = useCallback(() => {
    StellarWalletsKit.disconnect().catch(() => {
      // Best-effort; local state is cleared regardless.
    });
    setUser(null);
    setIsConnected(false);
  }, []);

  const signer = user ? makeSigner(user.publicKey) : null;

  return (
    <WalletContext.Provider value={{ user, isConnected, login, logout, error, signer }}>
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
        <span className="flex items-center gap-2 text-sm font-medium text-ink bg-surface-2 border border-line rounded-sm px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
          {user.publicKey.slice(0, 6)}...{user.publicKey.slice(-4)}
        </span>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm font-semibold text-danger bg-danger-tint rounded-sm hover:opacity-80 transition-opacity"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="px-4 py-2 text-sm font-semibold text-white bg-amber rounded-sm shadow-sm hover:bg-amber-deep transition-colors"
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
