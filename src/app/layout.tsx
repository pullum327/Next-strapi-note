import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = { title:'News App', description:'Next.js + Strapi' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-50 bg-[var(--card)] backdrop-blur border-b border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
              <div className="font-semibold">News App</div>
              <ThemeToggle/>
            </div>
          </header>

          {/* Main 撐開高度，footer 會貼底 */}
          <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto bg-[var(--card)] border-t border-[var(--border)]">
            <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-[var(--muted)] text-center">
              © {new Date().getFullYear()} <span className="font-semibold">News App</span>. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
