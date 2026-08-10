import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './hr-admin-portal/Dashboard';
import WelcomePage from './hr-admin-portal/WelcomePage';
import HomePage from './hr-admin-portal/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Home Layout */}
        <Route path="/home" element={<HomePage />}>
          <Route index element={<WelcomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all route to redirect any unknown links to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
