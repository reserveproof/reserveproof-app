import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ReserveProof',
  description: 'On-chain proof-of-reserves for Stellar anchors and stablecoin issuers',
  icons: {
    icon: '🧭',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
