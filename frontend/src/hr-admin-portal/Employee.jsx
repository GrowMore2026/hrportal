import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './EmployeeSidebar.css';

const navItems = [
  { label: 'Employee' },
  {
    label: 'Main',
    expandable: true,
    subItems: ['Analytics Hub', 'Employee Directory', 'Organization Chart'],
  },
  { label: 'Information' },
  { label: 'Admin' },
  { label: 'Setup' },
];

export default function Employee() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [activeItem, setActiveItem] = useState('Employee');

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="emp-page-layout">
      {/* ── Sidebar ── */}
      <aside className="emp-sidebar">
        {/* Breadcrumb inside sidebar */}
        <div className="emp-sidebar-breadcrumb">
          <Link to="/home" className="gm-breadcrumb-link">Home</Link>
          <span className="gm-breadcrumb-separator">&gt;</span>
          <span className="gm-breadcrumb-current">Employee</span>
        </div>

        {/* Navigation */}
        <nav className="emp-sidebar-nav">
          {navItems.map((item) => (
            <div key={item.label}>
              <div
                className={`emp-nav-item ${activeItem === item.label ? 'active' : ''}`}
                onClick={() => {
                  setActiveItem(item.label);
                  if (item.expandable) toggleExpand(item.label);
                  else if (item.path) navigate(item.path);
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className="emp-nav-label">{item.label}</span>
                {item.expandable && (
                  <span className={`emp-nav-chevron ${expanded[item.label] ? 'open' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                )}
              </div>
              {item.expandable && expanded[item.label] && (
                <div className="emp-sub-menu">
                  {item.subItems.map((sub) => (
                    <div key={sub} className="emp-sub-item">{sub}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="emp-main-content">
        {/* Page content goes here */}
      </main>
    </div>
  );
}
