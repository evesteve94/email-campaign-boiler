import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
