// Ensure window.fetch is writable and has a setter in environments with getter-only fetch
try {
  const win = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? (globalThis as unknown as Window) : null);
  if (win) {
    let activeFetch = win.fetch ? win.fetch.bind(win) : undefined;
    const desc = {
      get() {
        return activeFetch;
      },
      set(fn: typeof fetch) {
        activeFetch = fn;
      },
      configurable: true,
      enumerable: true,
    };
    try { Object.defineProperty(win, 'fetch', desc); } catch {}
    const proto = Object.getPrototypeOf(win);
    if (proto) {
      try { Object.defineProperty(proto, 'fetch', desc); } catch {}
    }
  }
} catch {
  // Silent fallback
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
