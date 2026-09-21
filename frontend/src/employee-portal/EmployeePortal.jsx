import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../hr-admin-portal/HomePage/Dashboard.css';
import './EmployeePortal.css';



export default function EmployeePortal({ userName = 'Krushant' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const appsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (appsMenuRef.current && !appsMenuRef.current.contains(e.target)) {
        setShowAppsMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="ep-app-container">
      {/* Top Nav (Admin style full width) */}
      <header className="gm-dash-nav" style={{ flexShrink: 0 }}>
        
        {/* App switcher grid dots */}
        <div className="gm-apps-menu-container" ref={appsMenuRef} style={{ position: 'relative' }}>
          <button 
            className={`gm-nav-apps-btn ${showAppsMenu ? 'active' : ''}`} 
            aria-label="Apps"
            onClick={() => setShowAppsMenu(!showAppsMenu)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/>
              <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="14" cy="8" r="1.5"/>
              <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/><circle cx="14" cy="14" r="1.5"/>
            </svg>
          </button>

          {showAppsMenu && (
            <div className="gm-apps-dropdown">
              <div className="gm-apps-columns-container">
                
                {/* Column 1: Home, Engage, To do */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginBottom: '8px' }} onClick={() => { navigate('/employee-portal'); setShowAppsMenu(false); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Home
                  </div>
                  
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginTop: '16px', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    Engage
                  </div>

                  <div className="gm-apps-col-heading" style={{ marginTop: '16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    To do
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    <div className="gm-app-name">Task</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    <div className="gm-app-name">Review</div>
                  </div>
                </div>

                {/* Column 2: Salary */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                    Salary
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    <div className="gm-app-name">Pay slip</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    <div className="gm-app-name">YTD reports</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="gm-app-name">IT statement</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="gm-app-name">IT Declaration</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    <div className="gm-app-name">Loans and Advances</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    <div className="gm-app-name">Reimbursement</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <div className="gm-app-name">Proof Of Investment</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    <div className="gm-app-name">Salary Revision</div>
                  </div>
                </div>

                {/* Column 3: Leave */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Leave
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="gm-app-name">Leave Apply</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <div className="gm-app-name">Leave Balances</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div className="gm-app-name">Leave Calendar</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div className="gm-app-name">Holiday Calendar</div>
                  </div>
                </div>

                {/* Column 4: Attendance */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Attendance
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div className="gm-app-name">Attendance Info</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <div className="gm-app-name">Regularization & Permission</div>
                  </div>
                </div>

                {/* Column 5: Document Center, People, Helpdesk, Request Hub */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    Document Center
                  </div>
                  
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginTop: '16px', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    People
                  </div>
                  
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginTop: '16px', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Helpdesk
                  </div>
                  
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer', marginTop: '16px', marginBottom: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Request Hub
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <Link to="/employee-portal" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/Logos/logo.png" alt="Company Logo" className="gm-brand-logo-img" />
        </Link>

        {/* Search bar */}
        <div className="gm-nav-search" style={{ cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <span>Search Anything</span>
          <kbd>Ctrl + K</kbd>
        </div>

        {/* Right side actions */}
        <div className="gm-nav-actions">
          
          {/* User Profile Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1c9c6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Hi {userName || 'Krushant'}</span>
              <span style={{ fontSize: '12px', color: '#1c9c6e', cursor: 'pointer', fontWeight: '500' }}>View My Info</span>
            </div>
          </div>

          {/* Settings */}
          <button className="gm-nav-settings-btn" aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6c.6.3 1.4.2 1.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9c.3.6.9 1 1.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" />
            </svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Divider */}
          <div className="gm-nav-divider" />

          {/* Logout */}
          <button className="gm-icon-btn" aria-label="Logout" onClick={() => setShowLogoutModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Body with Sidebar and Main Content */}
      <div className="ep-body-container">
        

  
        {/* Main Content Area */}
        <div className="ep-main">
          {/* Dashboard Content */}
          <div className="ep-content">
            <Outlet />
          </div>
        </div>
        
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="gm-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="gm-modal" style={{ width: 400, height: 'auto', padding: '40px 32px', textAlign: 'center', borderRadius: 32, fontFamily: "'Poppins', sans-serif" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: 24, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>Confirm Logout</h2>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16, fontWeight: 500 }}>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button style={{ flex: 1, padding: '14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#334155', fontFamily: "'Poppins', sans-serif" }} onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button style={{ flex: 1, padding: '14px', border: 'none', background: '#ef4444', color: '#fff', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: "'Poppins', sans-serif" }} onClick={() => navigate('/')}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
