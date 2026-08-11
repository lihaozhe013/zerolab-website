import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { ThemeModeProvider } from '@/ThemeModeProvider';
import '@/index.css';
import '@/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <App />
    </ThemeModeProvider>
  </StrictMode>,
);
