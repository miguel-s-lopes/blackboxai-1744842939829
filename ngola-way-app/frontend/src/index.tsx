import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Remove strict mode for development to avoid double mounting
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  process.env['NODE_ENV'] === 'development' ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Enable hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
