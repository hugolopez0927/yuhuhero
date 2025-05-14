import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import IntroScreen from './components/IntroScreen';
import FinancialQuiz from './components/FinancialQuiz';
import NotificationManager from './components/NotificationManager';
import NotificationContainer from './components/NotificationContainer';
import AdminAccessPage from './components/AdminAccessPage';
import AdminPanel from './components/AdminPanel';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <NotificationManager />
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/quiz" element={<FinancialQuiz />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ahorro" element={<div className="p-4"><h1>Ahorro - Próximamente</h1></div>} />
        <Route path="/inversion" element={<div className="p-4"><h1>Inversión - Próximamente</h1></div>} />
        <Route path="/deudas" element={<div className="p-4"><h1>Deudas - Próximamente</h1></div>} />
        <Route path="/admin" element={<AdminAccessPage />} />
        <Route 
          path="/admin/panel" 
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
