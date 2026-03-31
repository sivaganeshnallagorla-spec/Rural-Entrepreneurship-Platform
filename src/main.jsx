import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { seedDemoData } from './api/demoData'

console.log('Main.jsx: Entry point reached');

window.addEventListener('error', (event) => {
  console.error('Main.jsx: Global Error caught:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Main.jsx: Unhandled Rejection caught:', event.reason);
});

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('Main.jsx: Root created');
  root.render(
    <React.StrictMode>
      <HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </HashRouter>
    </React.StrictMode>
  );
  console.log('Main.jsx: Render called');
} catch (err) {
  console.error('Main.jsx: Mounting error:', err);
}

seedDemoData();
