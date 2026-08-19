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
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [viewAllActiveTab, setViewAllActiveTab] = useState('All');
  const [expandedFolders, setExpandedFolders] = useState({
    'Event List': true,
    'Employee List': true,
    'Headcount Summaries': true,
    'My Sheets': true
  });

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

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const handleReportSelect = (reportName) => {
    setActiveTab(reportName);
    setIsViewAllOpen(false);
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

  const reportFolders = [
    {
      name: 'Event List',
      count: 6,
      items: ['Confirmation Dues', 'Recent Resignees', 'Recent New Joiners', 'Upcoming Birthdays', 'Upcoming Anniversaries', 'Recent Transfers']
    },
    {
      name: 'Employee List',
      count: 7,
      items: ['Work Experience', 'Category Information', 'Contact List of All Employees', 'Blood Group Details', 'Department List with Manager Details', 'Personal Information (PII Data)', 'Basic Information']
    },
    {
      name: 'Headcount Summaries',
      count: 8,
      items: ['Years in Service Headcount', 'Total Experience Headcount', 'Age-wise Headcount', 'Gender-wise Headcount', 'Location-wise Headcount', 'Employment Status Headcount', 'Location-wise Blood Group Headcount', 'Location-wise Gender Headcount']
    },
    {
      name: 'My Sheets',
      count: 1,
      items: ['All Employee Info']
    }
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

          {isViewAllOpen ? (
            <div className="analytics-view-all-page">
              
              <button className="analytics-go-back-btn" onClick={() => setIsViewAllOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Go Back
              </button>

              <div className="analytics-view-all-search-wrapper">
                <input type="text" className="analytics-view-all-search" placeholder="Search" />
              </div>

              <div className="analytics-view-all-tabs" style={{ justifyContent: 'flex-end' }}>
                <button className="analytics-add-folder-btn">Add Folder</button>
              </div>

              <div className="analytics-folder-list">
                {reportFolders.map(folder => (
                  <div key={folder.name} className="analytics-folder-container">
                    <div className="analytics-folder-header" onClick={() => toggleFolder(folder.name)}>
                      <svg 
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ transform: expandedFolders[folder.name] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      {folder.name}({folder.count})
                    </div>
                    {expandedFolders[folder.name] && (
                      <div className="analytics-folder-content">
                        {folder.items.map(item => (
                          <div key={item} className="analytics-report-item" onClick={() => handleReportSelect(item)}>
                            <svg className="analytics-report-star" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={(e) => e.stopPropagation()}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="analytics-recent-section">
                <div className="analytics-recent-header">
                  <span>Recent</span>
                  <button 
                    className="analytics-view-all" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => setIsViewAllOpen(true)}
                  >
                    View All
                  </button>
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
                  <h3 className="analytics-table-title">{activeTab}</h3>
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
                    {activeTab === 'Location-wise Headcount' ? (() => {
                      const locationCounts = {};
                      filteredEmployees.forEach(emp => {
                        const loc = emp.location || 'Unassigned';
                        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
                      });

                      return (
                        <table className="emp-results-table">
                          <thead>
                            <tr>
                              <th>Location</th>
                              <th>Headcount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                              <tr>
                                <td colSpan="2" style={{textAlign: 'center', padding: '48px'}}>
                                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
                                    <div className="emp-spinner"></div>
                                    <p className="emp-search-loading-text">Loading Data...</p>
                                  </div>
                                </td>
                              </tr>
                            ) : Object.keys(locationCounts).length === 0 ? (
                              <tr><td colSpan="2" className="emp-no-results">No data found.</td></tr>
                            ) : (
                              Object.entries(locationCounts).map(([loc, count]) => (
                                <tr key={loc} className="emp-search-row-clickable">
                                  <td style={{fontWeight: 500}}>{loc}</td>
                                  <td>{count}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      );
                    })() : activeTab === 'Location-wise Blood Group Headcount' ? (() => {
                      const locationBloodGroupData = {};
                      const allBloodGroups = new Set();
                      
                      filteredEmployees.forEach(emp => {
                        const loc = emp.location || 'Unassigned';
                        const bg = emp.blood_group || 'Unassigned';
                        if (!locationBloodGroupData[loc]) {
                          locationBloodGroupData[loc] = { total: 0 };
                        }
                        locationBloodGroupData[loc][bg] = (locationBloodGroupData[loc][bg] || 0) + 1;
                        locationBloodGroupData[loc].total += 1;
                        allBloodGroups.add(bg);
                      });
                      
                      const sortedBloodGroups = Array.from(allBloodGroups).sort();

                      return (
                        <table className="emp-results-table">
                          <thead>
                            <tr>
                              <th>Location</th>
                              {sortedBloodGroups.map(bg => <th key={bg} style={{ textAlign: 'center' }}>{bg}</th>)}
                              <th style={{ textAlign: 'center', backgroundColor: '#f0fdf4', color: '#1c9c6e' }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                              <tr>
                                <td colSpan={sortedBloodGroups.length + 2} style={{textAlign: 'center', padding: '48px'}}>
                                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
                                    <div className="emp-spinner"></div>
                                    <p className="emp-search-loading-text">Loading Data...</p>
                                  </div>
                                </td>
                              </tr>
                            ) : Object.keys(locationBloodGroupData).length === 0 ? (
                              <tr><td colSpan={sortedBloodGroups.length + 2} className="emp-no-results">No data found.</td></tr>
                            ) : (
                              Object.entries(locationBloodGroupData).map(([loc, data]) => (
                                <tr key={loc} className="emp-search-row-clickable">
                                  <td style={{fontWeight: 500}}>{loc}</td>
                                  {sortedBloodGroups.map(bg => (
                                    <td key={bg} style={{ textAlign: 'center' }}>{data[bg] || 0}</td>
                                  ))}
                                  <td style={{fontWeight: 600, textAlign: 'center', backgroundColor: '#f0fdf4', color: '#1c9c6e'}}>{data.total}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      );
                    })() : (
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
                                    onClick={() => navigate('/employee/information/employee-profile', { state: { employee: emp } })}
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
                    )}
                  </div>

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
            </>
          )}

        </div>
      </main>
    </div>
  );
}
