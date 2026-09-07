import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkAuthWrapper } from './components/ClerkAuthWrapper';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateDetailsPage } from './pages/CandidateDetailsPage';
import { AgentVisualizerPage } from './pages/AgentVisualizerPage';
import { UploadCVPage } from './pages/UploadCVPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
        <Route path="/agent" element={<AgentVisualizerPage />} />
        <Route path="/upload" element={<UploadCVPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export function App() {
  return (
    <ClerkAuthWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </ClerkAuthWrapper>
  );
}

export default App;
