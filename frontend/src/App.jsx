import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './hr-admin-portal/HomePage/Dashboard';
import WelcomePage from './hr-admin-portal/HomePage/WelcomePage';
import HomePage from './hr-admin-portal/HomePage/HomePage';
import Employee from './hr-admin-portal/Employee/Employee';
import EmployeeProfile from './hr-admin-portal/Employee/EmployeeProfile';
import EmployeeProfileSearch from './hr-admin-portal/Employee/Information/Employee-profile/EmployeeProfileSearch';
import AnalyticsHub from './hr-admin-portal/Employee/Main/Analytics Hub/AnalyticsHub';
import EmployeeDirectory from './hr-admin-portal/Employee/Main/Employee Directory/EmployeeDirectory';
import OrganizationChart from './hr-admin-portal/Employee/Main/Organization Chart/OrganizationChart';
import MyProfile from './hr-admin-portal/Profile/MyProfile';
import Payroll from './hr-admin-portal/Payroll/Payroll';
import WorkforceManagement from './hr-admin-portal/Workforce-Management/WorkforceManagement';
import './App.css';

import FamilyDetails from './hr-admin-portal/Employee/Information/Family Details/FamilyDetails';

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
          <Route path="/employee/add-employee" element={<EmployeeProfile />} />
          <Route path="/employee/information/employee-profile" element={<EmployeeProfileSearch />} />
          <Route path="/employee/information/family-details" element={<FamilyDetails />} />
          <Route path="/employee/profile/:id" element={<MyProfile />} />
          <Route path="/employee/my-profile" element={<MyProfile />} />
          <Route path="/employee/main/analytics-hub" element={<AnalyticsHub />} />
          <Route path="/employee/main/employee-directory" element={<EmployeeDirectory />} />
          <Route path="/employee/main/organization-chart" element={<OrganizationChart />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/workforce-management" element={<WorkforceManagement />} />
        </Route>

        {/* Catch-all route to redirect any unknown links to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
