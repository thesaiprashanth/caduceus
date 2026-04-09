import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import ChatbotPage from './pages/ChatbotPage.tsx';
import Helpcenter from './pages/helpcenter.tsx';
import Login from './pages/Login.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/helpcenter" element={<Helpcenter />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);