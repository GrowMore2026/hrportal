import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './hr-admin-portal/Dashboard';
import WelcomePage from './hr-admin-portal/WelcomePage';
import HomePage from './hr-admin-portal/HomePage';
import Employee from './hr-admin-portal/Employee';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Main Layout with Top Nav */}
        <Route element={<HomePage />}>
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/home/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<Employee />} />
        </Route>

        {/* Catch-all route to redirect any unknown links to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
