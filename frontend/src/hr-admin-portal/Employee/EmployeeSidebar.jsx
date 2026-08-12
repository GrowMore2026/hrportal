import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './EmployeeSidebar.css';

/* ── Sidebar nav config ── */
const navItems = [
  { label: 'Employee', path: '/employee' },
  {
    label: 'Main',
    expandable: true,
    subItems: ['Analytics Hub', 'Employee Directory', 'Organization Chart'],
  },
  {
    label: 'Information',
    expandable: true,
    subItems: ['Employee Profile', 'Bank/PF/ESI', 'Family Details', 'Employee Asset Management', 'Position History', 'Previous Employment', 'Separation', 'Access Card Details', 'Employee Documents', 'Employee Documents', 'Employee Contracts', 'Employee Salary'],
  },
  {
    label: 'Admin',
    expandable: true,
    subItems: ['Generate Letter', 'Excel Import', 'Bulk Document Upload', 'Bulk Photo Upload', 'Bulletian Borad', 'Mass Communication', 'Identity Verification', 'Contract Details', 'Data Drive'],
  },
  {
    label: 'Setup',
    expandable: true,
    subItems: ['Letter Template', 'Company Policies & Forms', 'Employee Segment', 'Employee Filter', 'Org Management'],
  },
];

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Set active states based on current route
  const isActiveSub = (sub) => {
    if (sub === 'Employee Profile' && pathname === '/employee/employee-profile') return true;
    if (sub === 'Employee Directory' && pathname === '/employee-search') return true;
    return false;
  };

  // Determine which section to expand initially
  const getInitialExpanded = () => {
    if (pathname === '/employee/employee-profile') return { Information: true };
    if (pathname === '/employee-search') return { Main: true };
    return {};
  };

  const [expanded, setExpanded] = useState(getInitialExpanded());
  const [activeItem, setActiveItem] = useState(() => {
    if (pathname === '/employee/employee-profile') return 'Information';
    if (pathname === '/employee-search') return 'Main';
    return 'Employee';
  });

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
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
                  <div 
                    key={sub} 
                    className={`emp-sub-item ${isActiveSub(sub) ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (sub === 'Employee Profile') {
                        navigate('/employee/employee-profile');
                      } else if (sub === 'Employee Directory') {
                        navigate('/employee-search');
                      }
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
