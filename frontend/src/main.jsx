import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Standard import
import './index.css';

// DO NOT wrap CartProvider here if it is already inside App.jsx.
// Just make sure App.jsx is importing it correctly.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);