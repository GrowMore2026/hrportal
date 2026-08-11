import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Employee/EmployeeSidebar.css';

const navItems = [
  { label: 'Workforce Management' },
  {
    label: 'Leave',
    expandable: true,
    subItems: ['Leave Calendar', 'Employee Leave', 'Leave Granter', 'Year End Process', 'Leave Recalculator'],
  },
  {
    label: 'Attendance',
    expandable: true,
    subItems: ['Attendance Overview', 'Who Is In?', 'Shift Roster', 'Employee Swipes', 'Regularization & Permission', 'Attendance Muster', 'Attendance Info', 'Process Attendance', 'Attendance Period Finalisation', 'Attendance Exception', 'Manual Override', 'Shift Override'],
  },
  {
    label: 'Admin Tools',
    expandable: true,
    subItems: ['Lock Configuration', 'Holiday List', 'Weekend Override', 'Swipe Management', 'Shift Rotation Calendar', 'Assign Attendance Scheme', 'Employee Week Days', 'Leave Type Reviewer', 'IP Address Mapping'],
  }
];

export default function WorkforceSidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [activeItem, setActiveItem] = useState('Workforce Management');

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="emp-sidebar">
      <div className="emp-sidebar-breadcrumb">
        <Link to="/home" className="gm-breadcrumb-link">Home</Link>
        <span className="gm-breadcrumb-separator">&gt;</span>
        <span className="gm-breadcrumb-current">Workforce Management</span>
      </div>

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
  );
}
