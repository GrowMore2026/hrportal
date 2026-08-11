import React from 'react';
import WorkforceSidebar from './WorkforceSidebar';
import '../Employee/EmployeeSidebar.css';

export default function WorkforceManagement() {
  return (
    <div className="emp-page-layout">
      {/* ── Sidebar ── */}
      <WorkforceSidebar />

      {/* ── Main Content ── */}
      <main className="emp-main-content">
        <div style={{ padding: '24px' }}>
          <h1>Workforce Management</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Select an option from the sidebar to manage attendance, leaves, and shifts.</p>
        </div>
      </main>
    </div>
  );
}
