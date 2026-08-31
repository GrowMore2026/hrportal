import React from 'react';
import './EmployeeWelcome.css';

export default function EmployeeWelcome() {
  const holidays = [
    { date: '04 Sep', day: 'Friday', name: 'Janmashtami' },
    { date: '02 Oct', day: 'Friday', name: 'Gandhi Jayanti' },
    { date: '20 Oct', day: 'Tuesday', name: 'Dussehra' },
    { date: '08 Nov', day: 'Sunday', name: 'Diwali' },
  ];

  return (
    <div className="ew-container">
      {/* Hero Section */}
      <div className="ew-hero">
        <div className="ew-hero-text">
          <h2 className="ew-greeting">Good Morning</h2>
          <p className="ew-quote">Life is 10% what happens to us and 90% how we react to it.</p>
          <p className="ew-author">- Dennis P. Kimbro</p>
        </div>
        <div className="ew-hero-img">
          {/* Placeholder for the car/sun illustration */}
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
            <path d="M20 100 Q 120 80 220 100" stroke="#1e293b" strokeWidth="2" fill="none" />
            <circle cx="180" cy="40" r="30" fill="#f87171" />
            <rect x="140" y="70" width="40" height="30" rx="4" fill="#1c9c6e" />
            <path d="M145 75 h30 v10 h-30 z" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="ew-grid">
        
        {/* Column 1 */}
        <div className="ew-col">
          <div className="ew-card ew-review">
            <h3>Review</h3>
            <div className="ew-card-content ew-center">
              <div className="ew-icon-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <p>Hurrah! You've nothing to review.</p>
            </div>
          </div>

          <div className="ew-card ew-quick-access">
            <h3>Quick Access</h3>
            <div className="ew-qa-body">
              <div className="ew-qa-links">
                <a href="#payslip">Reimbursement Payslip</a>
                <a href="#it">IT Statement</a>
                <a href="#ytd">YTD Reports</a>
                <a href="#loan">Loan Statement</a>
              </div>
              <div className="ew-qa-highlight">
                <p>Use quick access to view important salary details.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="ew-col">
          <div className="ew-card ew-holidays">
            <div className="ew-card-header">
              <h3>Upcoming Holidays</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
            <div className="ew-holiday-list">
              {holidays.map((h, i) => (
                <div key={i} className="ew-holiday-item">
                  <div className="ew-holiday-date">
                    <strong>{h.date}</strong> <span>{h.day}</span>
                  </div>
                  <div className="ew-holiday-name">{h.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ew-card ew-status">
            <h3>IT Declaration</h3>
            <div className="ew-status-body">
              <div className="ew-status-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <p>Hold on! You can submit your Income Tax (IT) declaration once released.</p>
            </div>
          </div>

          <div className="ew-card ew-track">
            <h3>Track</h3>
            <div className="ew-card-content ew-center">
              <div className="ew-icon-placeholder">
                <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
                  <circle cx="20" cy="20" r="6" fill="#f87171" />
                  <circle cx="44" cy="20" r="6" fill="#f87171" />
                  <path d="M26 20 h12 M35 25 l10 15 h-15 z" stroke="#1e293b" strokeWidth="2" fill="#1c9c6e" />
                </svg>
              </div>
              <p>All good! You've nothing new to track.</p>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="ew-col">
          <div className="ew-card ew-payslip">
            <h3>Payslip</h3>
            <div className="ew-card-content ew-center">
              <div className="ew-icon-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <circle cx="12" cy="14" r="4" fill="#f87171" />
                  <line x1="4" y1="22" x2="10" y2="16" />
                </svg>
              </div>
              <p>Uh oh! Your Payslip will show up here after the release of Payroll.</p>
            </div>
          </div>

          <div className="ew-card ew-status">
            <h3>POI</h3>
            <div className="ew-status-body">
              <div className="ew-status-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <p>Hold on! You can submit your Proof of Investments (POI) once released.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
