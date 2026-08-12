import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../Employee/EmployeeSidebar';
import EmployeeProfileDetail from './EmployeeProfileDetail';
import '../Employee/EmployeeSidebar.css';
import './EmployeeProfileSearch.css';
import TelescopeGirl from './telescope_girl.png';

export default function EmployeeProfileSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const url = query.trim() 
          ? `http://localhost:5000/api/employees/search?query=${encodeURIComponent(query)}`
          : `http://localhost:5000/api/employees/search`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Failed to fetch employees', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search by 300ms
    const timerId = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div className="emp-page-layout">
      <EmployeeSidebar />
      <main className="emp-main-content">
        <div className="emp-search-layout">
          {/* Top Search Banner */}
          <div className="emp-search-banner">
            <div className="emp-search-left">
              <h1 className="emp-search-title">Start searching to see specific employee details here</h1>
              
              <div className="emp-search-type-dropdown">
                <span className="emp-type-label">Employee Type:</span>
                <span className="emp-type-value">
                  Current Employees 
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>

              <div className="emp-search-input-section">
                <label className="emp-search-label">Search Employee</label>
                <div className="emp-search-input-wrapper">
                  <div className="emp-search-icon-bg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <input 
                    type="text" 
                    className="emp-search-input" 
                    placeholder="Search by Emp No/ Name" 
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedEmployee(null);
                    }}
                  />
              <svg className="emp-search-magnifier" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
        
        <div className="emp-search-right">
          <img src={TelescopeGirl} alt="Search illustration" className="emp-search-illustration" />
          <button 
            className="emp-primary-btn"
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/employee/employee-profile/add-employee')}
          >
            + Add Employee
          </button>
        </div>
      </div>
        
        {selectedEmployee ? (
          <EmployeeProfileDetail employee={selectedEmployee} />
        ) : (query || results.length > 0) ? (
          <div className="emp-search-results-container">
        {isLoading ? (
          <p className="emp-search-loading">Searching...</p>
        ) : (
          <div className="emp-table-wrapper">
            <table className="emp-results-table">
              <thead>
                <tr>
                  <th>Emp No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((emp) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => setSelectedEmployee({
                        id: emp.emp_code || 'GM001',
                        name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Employee Name',
                        department: emp.department || 'Department',
                        designation: emp.designation || 'Designation',
                        email: emp.email || 'email@example.com',
                        status: emp.status || 'Active'
                      })}
                      style={{ cursor: 'pointer' }}
                      className="emp-search-row-clickable"
                    >
                      <td>{emp.emp_code || '-'}</td>
                      <td>{`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || '-'}</td>
                      <td>{emp.department || '-'}</td>
                      <td>{emp.designation || '-'}</td>
                      <td>{emp.email || '-'}</td>
                      <td>
                        <span className="emp-status-badge">{emp.status || 'Active'}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="emp-no-results">No employees found. Try a different search term.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
        ) : null}
      </div>
      </main>
    </div>
  );
}
