import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from '../../EmployeeSidebar';
import MyProfile from '../../../Profile/MyProfile';
import '../../EmployeeSidebar.css';
import './EmployeeProfileSearch.css';
import Papa from 'papaparse';

export default function EmployeeProfileSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(location.state?.employee || null);
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
              
              <div className="emp-search-input-section">
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
              
              {query.trim() !== '' && results.length > 0 && !selectedEmployee && (
                <div className="emp-search-autocomplete-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  zIndex: 50,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {results.map(emp => (
                    <div 
                      key={emp.id}
                      className="emp-search-autocomplete-item"
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setQuery('');
                      }}
                    >
                      <span style={{ fontWeight: 500, color: '#1c9c6e' }}>{`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Unknown Name'}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{emp.emp_code || 'No Code'} • {emp.designation || 'No Designation'}</span>
                    </div>
                  ))}
                </div>
              )}
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
              onClick={() => navigate('/employee/add-employee')}
            >
              + Add Employee
            </button>
          </div>
        </div>
      </div>
        
        {selectedEmployee ? (
          <MyProfile employeeId={selectedEmployee.id} isInline={true} />
        ) : (
          <div className="emp-search-placeholder">
            <div className="emp-search-placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Find an Employee</h3>
            <p>Start searching to see specific employee details here.</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
