import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Employee/EmployeeSidebar.css';

const navItems = [
  { label: 'Payroll' },
  {
    label: 'Information',
    expandable: true,
    subItems: ['Salary Revision History', 'Salary Revision Analytics'],
  },
  {
    label: 'Payroll Inputs',
    expandable: true,
    subItems: ['Salary', 'Loan', 'Salary Revisions', 'Income Tax', 'Employee LOP Days', 'Stop salary Porcessing', 'Arrears', 'Release Salary', 'Final Statement', 'Resettlement'],
  },
  {
    label: 'Process',
    expandable: true,
    subItems: ['Payroll Process'],
  },
  {
    label: 'Verify',
    expandable: true,
    subItems: ['Quick Salary Statement', 'Payroll Statement', 'Payroll Differences'],
  },
  {
    label: 'Payout',
    expandable: true,
    subItems: ['Accounts JV', 'Bank Transfer', 'Chaque / Cash Statement', 'Payslips', 'Hold Salary Payout'],
  },
  {
    label: 'Published Info',
    expandable: true,
    subItems: ['Payslip', 'CTC payslip', 'Reimbursement Statement', 'Loan Statement', 'IT Statement', 'IT Declaration', 'FBP Declaration'],
  },
  {
    label: 'Admin',
    expandable: true,
    subItems: ['Form 16', 'Form 138(From 24Q)', 'Employee IT Declaration', 'PAN Status', 'Revision Planner', 'Remittances', 'Payroll Release', 'POI Overview', 'PF KYC Mapping'],
  },
  {
    label: 'Setup',
    expandable: true,
    subItems: ['Pay Item Group', 'Payroll Repository', 'Sort Order', 'Payslip Gallery'],
  }
];

export default function PayrollSidebar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});
  const [activeItem, setActiveItem] = useState('Payroll');

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="emp-sidebar">
      {/* Breadcrumb inside sidebar */}
      <div className="emp-sidebar-breadcrumb">
        <Link to="/home" className="gm-breadcrumb-link">Home</Link>
        <span className="gm-breadcrumb-separator">&gt;</span>
        <span className="gm-breadcrumb-current">Payroll</span>
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
  );
}
