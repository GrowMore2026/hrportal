import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../../EmployeeSidebar';
import '../Analytics Hub/AnalyticsHub.css';
import '../../EmployeeSidebar.css';
import '../../Information/Employee-profile/EmployeeProfileSearch.css';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) {
          const sortedEmployees = data.employees.sort((a, b) => {
            const codeA = a.emp_code || '';
            const codeB = b.emp_code || '';
            return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
          });
          setEmployees(sortedEmployees);
        }
      })
      .catch(err => console.error('Error fetching employees:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  const handleNameClick = (emp) => {
    navigate('/information/employee-profile', { state: { employee: emp } });
  };

  return (
    <div className="emp-page-layout">
      <EmployeeSidebar />
      
      <main className="emp-main-content" style={{ padding: 0 }}>
        <div className="analytics-hub-container">
          
          <div className="analytics-top-controls">
            <select className="analytics-control-select">
              <option>Payroll Month: Jun'26</option>
            </select>
            <select className="analytics-control-select">
              <option>All</option>
            </select>
            <button className="analytics-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </button>
          </div>

          <div className="analytics-table-card">
            <div className="analytics-table-header">
              <h3 className="analytics-table-title">Employee Directory</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="emp-outline-btn" style={{ padding: '8px 16px', border: '1px solid #1c9c6e', color: '#1c9c6e', background: 'transparent', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => {e.target.style.background = '#e6f4ef'; e.target.style.borderColor = '#157a55';}} onMouseLeave={(e) => {e.target.style.background = 'transparent'; e.target.style.borderColor = '#1c9c6e';}}>Export to Excel</button>
                <Link to="/employee/add-employee" className="emp-primary-btn" style={{textDecoration: 'none'}}>Add Employee</Link>
              </div>
            </div>
            
            <div className="analytics-table-toolbar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select className="analytics-control-select" style={{ minWidth: '180px' }}>
                <option>Category: All</option>
              </select>
              <select className="analytics-control-select" style={{ minWidth: '180px' }}>
                <option>Employment Status: All</option>
              </select>
              <select className="analytics-control-select" style={{ minWidth: '220px' }}>
                <option>Employee Filter: Current Employees</option>
              </select>
              <select className="analytics-control-select" style={{ minWidth: '150px' }}>
                <option>Employee: All</option>
              </select>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div className="analytics-table-wrapper" style={{ flex: 1 }}>
                <table className="emp-results-table">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', left: 0, zIndex: 3, minWidth: '60px', background: '#f9fafb' }}>#</th>
                      <th style={{ position: 'sticky', left: '60px', zIndex: 3, minWidth: '140px', background: '#f9fafb' }}>Employee No <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg></th>
                      <th style={{ position: 'sticky', left: '200px', zIndex: 3, minWidth: '220px', background: '#f9fafb' }}>Employee Name</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Phone No</th>
                      <th>Email</th>
                      <th>Extension Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="8" style={{textAlign: 'center', padding: '48px'}}>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
                            <div className="emp-spinner"></div>
                            <p className="emp-search-loading-text">Loading Data...</p>
                          </div>
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr><td colSpan="8" className="emp-no-results">No employees found.</td></tr>
                    ) : (
                      employees.map((emp, index) => (
                        <tr key={emp.id || index}>
                          <td style={{ position: 'sticky', left: 0, zIndex: 2, background: 'inherit' }}>{index + 1}.</td>
                          <td style={{ position: 'sticky', left: '60px', zIndex: 2, background: 'inherit' }}>{emp.emp_code}</td>
                          <td style={{ position: 'sticky', left: '200px', zIndex: 2, background: 'inherit' }}>
                            <span 
                              style={{ color: '#1c9c6e', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
                              onClick={() => handleNameClick(emp)}
                            >
                              {`${emp.first_name || ''} ${emp.last_name || ''}`.trim()}
                            </span>
                          </td>
                          <td>{formatDate(emp.doj)}</td>
                          <td>{emp.status || 'Confirmed'}</td>
                          <td>{emp.mobile}</td>
                          <td>{emp.email}</td>
                          <td></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="analytics-pagination" style={{ borderTop: '1px solid #e2e8f0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
              <div>Total Items: {employees.length}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
