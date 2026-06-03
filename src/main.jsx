import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ─── 🛠️ นำเข้าโลโก้จากโฟลเดอร์ assets ───
import joppyFavicon from './assets/Joppy.svg';

// ─── 🛠️ สั่งให้เปลี่ยนค่า href ของแท็บไอคอนใน index.html ทันทีตอนระบบเริ่มรัน ───
const faviconLink = document.querySelector("link[rel~='icon']");
if (faviconLink) {
  faviconLink.href = joppyFavicon;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);