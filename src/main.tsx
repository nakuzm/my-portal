import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationsProvider } from './context/NotificationsProvider.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </StrictMode>,
);
