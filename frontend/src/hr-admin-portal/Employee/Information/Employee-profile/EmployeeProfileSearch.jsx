import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../../EmployeeSidebar';
import EmployeeProfileDetail from './EmployeeProfileDetail';
import '../../EmployeeSidebar.css';
import './EmployeeProfileSearch.css';
import Papa from 'papaparse';

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await fetch('http://localhost:5000/api/employees/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employees: results.data }),
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to upload bulk employees');
          }

          const data = await response.json();
          alert(`Success: ${data.message}`);
          // Trigger reload by temporarily resetting query
          setQuery('');
          setTimeout(() => setQuery(' '), 100);
        } catch (error) {
          console.error(error);
          alert(`Error uploading CSV: ${error.message}`);
        } finally {
          setIsLoading(false);
          e.target.value = ''; // Reset input
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

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
        
        <div className="emp-search-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/example_employees.csv" download="example_employees.csv" title="Download Template" style={{ color: '#1c9c6e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
            </a>
            <label title="Upload CSV" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
            <button 
              className="emp-primary-btn"
              onClick={() => navigate('/employee/employee-profile/add-employee')}
            >
              + Add Employee
            </button>
          </div>
        </div>
      </div>
        
        {selectedEmployee ? (
          <EmployeeProfileDetail employee={selectedEmployee} />
        ) : (query || results.length > 0) ? (
          <div className="emp-search-results-container">
        {isLoading ? (
          <div className="emp-search-loading-container">
            <div className="emp-spinner"></div>
            <p className="emp-search-loading-text">Searching employees...</p>
          </div>
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
                        ...emp,
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
