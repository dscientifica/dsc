
import './globals.css';
import type { ReactNode } from 'react';
import { getMessages } from '@/lib/i18n';

export const metadata = { title: 'ISO 17025 Calibration' };

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = 'pt-BR'; // simplificado; pode ler cookie
  const messages = getMessages(locale);
  return (
    <html lang={locale}>
      <body>
        <header style={{padding:'12px', borderBottom:'1px solid #ddd'}}>
          <strong>{messages['app.title']}</strong>
        </header>
        <main style={{padding:'16px'}}>{children}</main>
      </body>
    </html>
  );
}
