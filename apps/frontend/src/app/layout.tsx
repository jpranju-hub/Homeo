import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/globals.css';

export const metadata: Metadata = {
  title: 'Homeo - Patient Management System',
  description: 'Professional homeopathic patient management SaaS application',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
