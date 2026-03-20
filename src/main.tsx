import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppStateProvider } from './state/AppState';
import { PinnedFeaturesProvider } from './state/PinnedFeatures';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppStateProvider>
        <PinnedFeaturesProvider>
          <App />
        </PinnedFeaturesProvider>
      </AppStateProvider>
    </BrowserRouter>
  </StrictMode>,
);
