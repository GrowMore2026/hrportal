import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../../EmployeeSidebar';
import './AnalyticsHub.css';
import '../../EmployeeSidebar.css';
import '../../Information/Employee-profile/EmployeeProfileSearch.css';

export default function AnalyticsHub() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All Employee Info');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
        setFilteredEmployees(data.employees || []);
      }
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredEmployees(employees);
      return;
    }
    const filtered = employees.filter(emp => 
      (emp.emp_code && emp.emp_code.toLowerCase().includes(query)) ||
      (emp.first_name && emp.first_name.toLowerCase().includes(query)) ||
      (emp.last_name && emp.last_name.toLowerCase().includes(query)) ||
      (emp.email && emp.email.toLowerCase().includes(query))
    );
    setFilteredEmployees(filtered);
  };

  const tabs = [
    'All Employee Info',
    'Location-wise Headcount',
    'Employment Status Headcount',
    'Location-wise Blood Group Headcount',
    'Location-wise Gender Headcount',
    'Basic Information',
    'Personal Information (PII Data)'
  ];

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

          <div className="analytics-recent-section">
            <div className="analytics-recent-header">
              <span>Recent</span>
              <a href="#" className="analytics-view-all">View All</a>
            </div>
            <div className="analytics-tabs-row">
              {tabs.map(tab => (
                <div 
                  key={tab} 
                  className={`analytics-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-table-card">
            <div className="analytics-table-header">
              <h3 className="analytics-table-title">All Employee Info</h3>
              <Link to="/employee/add-employee" className="emp-primary-btn" style={{textDecoration: 'none'}}>Add Employee</Link>
            </div>
            
            <div className="analytics-table-toolbar">
              <input 
                type="text" 
                className="analytics-search-input" 
                placeholder="Search" 
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="analytics-toolbar-right">
                <a href="#" className="analytics-restore-link">Restore</a>
                <button className="analytics-icon-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div className="analytics-table-wrapper" style={{ flex: 1 }}>
                <table className="emp-results-table">
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Emp Name</th>
                      <th>DOJ</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Birthday</th>
                      <th>Email ID</th>
                      <th>Mobile</th>
                      <th>Blood Group</th>
                      <th>Marital Status</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Location</th>
                      <th>Reporting To</th>
                      <th>Status <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginLeft: '4px'}}><polyline points="6 9 12 15 18 9"></polyline></svg></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="15" style={{textAlign: 'center', padding: '48px'}}>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
                            <div className="emp-spinner"></div>
                            <p className="emp-search-loading-text">Loading Data...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredEmployees.length === 0 ? (
                      <tr><td colSpan="15" className="emp-no-results">No employees found.</td></tr>
                    ) : (
                      filteredEmployees.map(emp => {
                        const dobDate = emp.dob ? new Date(emp.dob) : null;
                        const dobStr = dobDate ? dobDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : '';
                        const birthdayStr = dobDate ? dobDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '';
                        const dojStr = emp.doj ? emp.doj : '';

                        return (
                          <tr key={emp.id} className="emp-search-row-clickable">
                            <td>{emp.emp_code}</td>
                            <td 
                              style={{fontWeight: 500, cursor: 'pointer', color: '#1c9c6e'}} 
                              onClick={() => navigate('/information/employee-profile', { state: { employee: emp } })}
                            >
                              {emp.first_name} {emp.last_name}
                            </td>
                            <td>{dojStr}</td>
                            <td>{emp.gender}</td>
                            <td>{dobStr}</td>
                            <td>{birthdayStr}</td>
                            <td>{emp.email || '-'}</td>
                            <td>{emp.mobile || '-'}</td>
                            <td>{emp.blood_group || '-'}</td>
                            <td>{emp.marital_status || '-'}</td>
                            <td>{emp.department || '-'}</td>
                            <td>{emp.designation || '-'}</td>
                            <td>{emp.location || '-'}</td>
                            <td>{emp.reporting_to || '-'}</td>
                            <td><span className={`emp-status-badge ${(emp.status === 'Probation' || !emp.status) ? 'emp-status-probation' : ''}`}>{emp.status || 'Probation'}</span></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Side Panels visually included as seen in screenshot */}
              <div style={{ width: '40px', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
                <div style={{ padding: '16px 8px', borderBottom: '1px solid #e2e8f0', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                  Columns
                </div>
                <div style={{ padding: '16px 8px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
                  Filters
                </div>
              </div>
            </div>

            <div className="analytics-table-footer">
              <span>Total Items: {employees.length}</span>
              <span>Filtered Items: {filteredEmployees.length}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
