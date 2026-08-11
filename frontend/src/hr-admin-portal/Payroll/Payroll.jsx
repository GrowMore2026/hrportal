import React from 'react';
import PayrollSidebar from './PayrollSidebar';
import '../Employee/EmployeeSidebar.css';

export default function Payroll() {
  return (
    <div className="emp-page-layout">
      {/* ── Sidebar ── */}
      <PayrollSidebar />

      {/* ── Main Content ── */}
      <main className="emp-main-content">
        <div style={{ padding: '24px' }}>
          <h1>Payroll Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Select an option from the sidebar to begin.</p>
        </div>
      </main>
    </div>
  );
}
