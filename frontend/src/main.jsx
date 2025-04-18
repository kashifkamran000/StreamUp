import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { PersistGate } from 'redux-persist/integration/react';  // Import PersistGate
import App from './App.jsx';
import './index.css';
import store from './store/store.js';
import { persistor } from './store/store.js';  // Import persistor

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>  
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
