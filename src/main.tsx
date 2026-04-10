import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import App from './App.tsx';
import ChatbotPage from './pages/ChatbotPage.tsx';
import Helpcenter from './pages/helpcenter.tsx';
import Login from './pages/Login.tsx';
import AgentsPage from './pages/Agents.tsx';
import DealsPage from './pages/Deals.tsx';
import NotificationPage from './pages/notification.tsx';
import CRMDashboardPage from './pages/CRMDashboardPage.tsx';
import LeadPipelinePage from './pages/LeadPipelinePage.tsx';
import AutomationPage from './pages/AutomationPage.tsx';
import { DealsProvider } from './context/DealsContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DealsProvider>
      <Routes>
        {/* Standalone pages (no sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<ChatbotPage />} />

        {/* Pages with sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/crm-dashboard" element={<CRMDashboardPage />} />
          <Route path="/lead-pipeline" element={<LeadPipelinePage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/help-center" element={<Helpcenter />} />
        </Route>
      </Routes>
      </DealsProvider>
    </BrowserRouter>
  </StrictMode>,
);