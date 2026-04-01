// This file makes it easy to import icons into your React components
// This prevents the "Module not found" error
const icons = {
  focused: "https://via.placeholder.com/50?text=Focused", 
  distracted: "https://via.placeholder.com/50?text=Distracted",
};

export default icons;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Add this import
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap App here */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);