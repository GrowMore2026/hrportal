import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '../../EmployeeSidebar';
import '../../EmployeeSidebar.css';
import '../../Main/Analytics Hub/AnalyticsHub.css';
import '../../Information/Employee-profile/EmployeeProfileSearch.css';

export default function FamilyDetails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [familyData, setFamilyData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [viewingFamilyMember, setViewingFamilyMember] = useState(null);
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('Active');
  
  // Custom Notification Modal State
  const [notification, setNotification] = useState({ isOpen: false, message: '', type: 'warning' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    blood_group: '',
    relation: '',
    address_same_as_employee: false,
    copy_address_from: '',
    custom_address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    mobile: '',
    phone: '',
    email: '',
    profession: '',
    nationality: '',
    remarks: ''
  });
  const mockFamilyData = [
    { id: 1, name: 'Bamroliya Sagunaben Hasmukhbhai', relation: 'Mother', dob: '03 Jun 1971', age: '55 Yrs 2 Months', bloodGroup: 'B +Ve', gender: 'Female', nationality: 'Indian', profession: '', remarks: '' },
    { id: 2, name: 'Bamroliya Hasmukhbhai Karamashibhai', relation: 'Father', dob: '14 Jun 1970', age: '56 Yrs 2 Months', bloodGroup: 'B +Ve', gender: 'Male', nationality: 'Indian', profession: '', remarks: '' }
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let url = `http://localhost:5000/api/employees/search?status=${employeeStatusFilter}`;
        if (searchQuery.trim()) {
          url += `&query=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    if (searchQuery.trim() && !selectedEmployee) {
      const timerId = setTimeout(() => {
        fetchEmployees();
      }, 300);
      return () => clearTimeout(timerId);
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedEmployee, employeeStatusFilter]);

  // Fetch Family details when employee is selected
  const fetchFamilyDetails = async () => {
    if (!selectedEmployee) return;
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${selectedEmployee.id}/family`);
      if (response.ok) {
        const data = await response.json();
        setFamilyData(data.family || []);
      }
    } catch (err) {
      console.error('Error fetching family details:', err);
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      fetchFamilyDetails();
    } else {
      setFamilyData([]);
    }
  }, [selectedEmployee]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFamilyMember = async () => {
    if (!selectedEmployee) return;
    
    if (!formData.name.trim() || !formData.relation) {
      setNotification({ isOpen: true, message: 'Please provide at least a Name and Relation.', type: 'warning' });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const url = editingFamilyId 
        ? `http://localhost:5000/api/employees/family/${editingFamilyId}`
        : `http://localhost:5000/api/employees/${selectedEmployee.id}/family`;
        
      const response = await fetch(url, {
        method: editingFamilyId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Reset form & close modal
        setFormData({
          name: '', dob: '', gender: '', blood_group: '', relation: '',
          address_same_as_employee: false, copy_address_from: '', custom_address: '',
          country: '', state: '', city: '', pincode: '', mobile: '', phone: '', email: '',
          profession: '', nationality: '', remarks: ''
        });
        setEditingFamilyId(null);
        setIsModalOpen(false);
        // Refresh table
        fetchFamilyDetails();
      } else {
        const errorData = await response.json();
        setNotification({ isOpen: true, message: `Failed to save: ${errorData.error || 'Unknown error'}`, type: 'error' });
      }
    } catch (err) {
      console.error('Error adding family member:', err);
      setNotification({ isOpen: true, message: `Network error: ${err.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      name: item.name || '',
      dob: item.dob || '',
      gender: item.gender || '',
      blood_group: item.blood_group || '',
      relation: item.relation || '',
      address_same_as_employee: item.address_same_as_employee || false,
      copy_address_from: item.copy_address_from || '',
      custom_address: item.custom_address || '',
      country: item.country || '',
      state: item.state || '',
      city: item.city || '',
      pincode: item.pincode || '',
      mobile: item.mobile || '',
      phone: item.phone || '',
      email: item.email || '',
      profession: item.profession || '',
      nationality: item.nationality || '',
      remarks: item.remarks || ''
    });
    setEditingFamilyId(item.id);
    setIsModalOpen(true);
  };

  const handleDeleteFamilyMember = async () => {
    if (!editingFamilyId) return;
    
    if (!window.confirm("Are you sure you want to delete this family member?")) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/employees/family/${editingFamilyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setEditingFamilyId(null);
        setIsModalOpen(false);
        fetchFamilyDetails();
        setNotification({ isOpen: true, message: 'Family member deleted successfully.', type: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({ isOpen: true, message: `Failed to delete: ${errorData.error || 'Unknown error'}`, type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting family member:', err);
      setNotification({ isOpen: true, message: `Network error: ${err.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedData = familyData;

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

          <div className="analytics-table-card" style={{ marginTop: '20px' }}>
            <div className="analytics-table-header">
              <h3 className="analytics-table-title">Family Details</h3>
              <button 
                className="emp-primary-btn" 
                style={{textDecoration: 'none'}} 
                onClick={() => {
                  if (selectedEmployee) {
                    setFormData({
                      name: '', dob: '', gender: '', blood_group: '', relation: '',
                      address_same_as_employee: false, copy_address_from: '', custom_address: '',
                      country: '', state: '', city: '', pincode: '', mobile: '', phone: '', email: '',
                      profession: '', nationality: '', remarks: ''
                    });
                    setEditingFamilyId(null);
                    setIsModalOpen(true);
                  } else {
                    setNotification({ isOpen: true, message: 'Please search and select an employee first.', type: 'warning' });
                  }
                }}
              >
                Add Family Member
              </button>
            </div>
            
            <div className="analytics-table-toolbar" style={{ display: 'flex', gap: '15px' }}>
              <select 
                value={employeeStatusFilter} 
                onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#1e293b', backgroundColor: '#fff', fontSize: '14px', outline: 'none' }}
              >
                <option value="All">All Employees</option>
                <option value="Active">Current Employees</option>
                <option value="Resigned">Resigned Employees</option>
              </select>
              <div style={{ position: 'relative', width: '300px' }}>
                <input 
                  type="text" 
                  className="analytics-search-input" 
                  placeholder="Search Employee" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (selectedEmployee) setSelectedEmployee(null);
                  }}
                  style={{ width: '100%', paddingRight: searchQuery ? '35px' : undefined }}
                />
                
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedEmployee(null);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
                
                {searchQuery.trim() !== '' && results.length > 0 && !selectedEmployee && (
                  <div className="emp-search-autocomplete-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginTop: '4px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
                          setSearchQuery(`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.emp_code);
                          setResults([]);
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

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div className="analytics-table-wrapper" style={{ flex: 1 }}>
                <table className="emp-results-table">
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Name</th>
                      <th style={{ width: '120px' }}>Relation</th>
                      <th style={{ width: '100px' }}>DOB</th>
                      <th style={{ width: '120px' }}>Age</th>
                      <th style={{ width: '100px' }}>Blood Group</th>
                      <th style={{ width: '100px' }}>Gender</th>
                      <th style={{ width: '100px' }}>Nationality</th>
                      <th style={{ width: '120px' }}>Profession</th>
                      <th style={{ width: '60px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.length > 0 ? (
                      displayedData.map((item) => (
                        <tr key={item.id}>
                          <td 
                            style={{ color: '#1c9c6e', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setViewingFamilyMember(item)}
                          >
                            {item.name}
                          </td>
                          <td>{item.relation}</td>
                          <td>{item.dob ? new Date(item.dob).toLocaleDateString('en-GB') : ''}</td>
                          <td>
                            {item.dob ? (() => {
                              const birthDate = new Date(item.dob);
                              const today = new Date();
                              let years = today.getFullYear() - birthDate.getFullYear();
                              let months = today.getMonth() - birthDate.getMonth();
                              if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
                                years--;
                                months += 12;
                              }
                              return `${years} Yrs ${months} Months`;
                            })() : ''}
                          </td>
                          <td>{item.blood_group}</td>
                          <td>{item.gender}</td>
                          <td>{item.nationality}</td>
                          <td>{item.profession}</td>
                          <td>
                            <button className="analytics-icon-btn" title="Edit" onClick={() => handleEditClick(item)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                          Please search and select an employee to view their family details.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Add Family Member Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
              width: '800px', height: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0 }}>
                  {editingFamilyId ? 'Edit Family Member' : 'Add Family Member'} - {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                </h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFamilyId(null);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex' }}
                  title="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b' }}>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b' }}>DOB</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b' }}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b' }}>Blood Group</label>
                    <select name="blood_group" value={formData.blood_group} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="">Select</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b' }}>Relation</label>
                    <select name="relation" value={formData.relation} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="">Select</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Husband">Husband</option>
                      <option value="Wife">Wife</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '120px', marginTop: '10px' }}>
                    <input type="checkbox" name="address_same_as_employee" checked={formData.address_same_as_employee} onChange={handleInputChange} id="addrSame" />
                    <label htmlFor="addrSame" style={{ marginLeft: '8px', fontSize: '13px', color: '#64748b' }}>Address Same As employee</label>
                  </div>

                  {/* Conditional Address Fields */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px' }}>
                    <label style={{ width: '120px', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                      {formData.address_same_as_employee ? 'Copy Address From' : 'Address'}
                    </label>
                    {formData.address_same_as_employee ? (
                      <select name="copy_address_from" value={formData.copy_address_from} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <option value="">Select</option>
                        <option value="Present Address">Present Address</option>
                        <option value="Permanent Address">Permanent Address</option>
                      </select>
                    ) : (
                      <textarea 
                        name="custom_address" 
                        value={formData.custom_address} 
                        onChange={handleInputChange} 
                        placeholder="Enter full address..."
                        style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }}
                      />
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Profession</label>
                    <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Nationality</label>
                    <select name="nationality" value={formData.nationality} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                      <option value="">Select</option>
                      <option value="Indian">Indian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {/* Conditional Address Details */}
                  {!formData.address_same_as_employee && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Pin Code</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                      </div>
                    </>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Mobile</label>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ width: '100px', fontSize: '13px', color: '#64748b' }}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                  onClick={handleAddFamilyMember}
                  disabled={isSubmitting}
                  style={{ backgroundColor: isSubmitting ? '#94a3b8' : '#1c9c6e', color: 'white', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFamilyId(null);
                  }}
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'white', color: '#1c9c6e', padding: '8px 24px', borderRadius: '4px', border: '1px solid #1c9c6e', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                >
                  Cancel
                </button>
                {editingFamilyId && (
                  <button 
                    onClick={handleDeleteFamilyMember}
                    disabled={isSubmitting}
                    style={{ backgroundColor: 'white', color: '#ef4444', padding: '8px 24px', borderRadius: '4px', border: '1px solid #ef4444', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 500, marginLeft: 'auto' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Custom Notification Modal */}
        {notification.isOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: '#fff', padding: '25px', borderRadius: '8px',
              width: '400px', maxWidth: '90%', textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '15px' }}>
                {notification.type === 'error' ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                )}
              </div>
              <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '10px' }}>
                {notification.type === 'error' ? 'Error' : 'Warning'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' }}>
                {notification.message}
              </p>
              <button 
                onClick={() => setNotification({ ...notification, isOpen: false })}
                style={{ 
                  backgroundColor: '#1c9c6e', color: 'white', padding: '10px 30px', 
                  borderRadius: '4px', border: 'none', cursor: 'pointer', 
                  fontWeight: 500, width: '100%' 
                }}
              >
                Okay
              </button>
            </div>
          </div>
        )}

      </main>

      {/* View Family Member Modal */}
      {viewingFamilyMember && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
            width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0 }}>
                Family Member Details - {selectedEmployee?.first_name} {selectedEmployee?.last_name}
              </h2>
              <button 
                onClick={() => setViewingFamilyMember(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex' }}
                title="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px', color: '#334155' }}>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Name</strong> {viewingFamilyMember.name || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Relation</strong> {viewingFamilyMember.relation || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>DOB</strong> {viewingFamilyMember.dob ? new Date(viewingFamilyMember.dob).toLocaleDateString('en-GB') : '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Gender</strong> {viewingFamilyMember.gender || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Blood Group</strong> {viewingFamilyMember.blood_group || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Profession</strong> {viewingFamilyMember.profession || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Nationality</strong> {viewingFamilyMember.nationality || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Mobile</strong> {viewingFamilyMember.mobile || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Phone</strong> {viewingFamilyMember.phone || '-'}</div>
              <div><strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Email</strong> {viewingFamilyMember.email || '-'}</div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' }}>
              <strong style={{ color: '#1c9c6e', display: 'block', marginBottom: '4px' }}>Address</strong>
              {viewingFamilyMember.address_same_as_employee 
                ? `Same as Employee (${viewingFamilyMember.copy_address_from || 'Present Address'})`
                : (
                  <>
                    <div>{viewingFamilyMember.custom_address || '-'}</div>
                    <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div><span style={{ color: '#1c9c6e', fontWeight: 500 }}>City:</span> {viewingFamilyMember.city || '-'}</div>
                      <div><span style={{ color: '#1c9c6e', fontWeight: 500 }}>State:</span> {viewingFamilyMember.state || '-'}</div>
                      <div><span style={{ color: '#1c9c6e', fontWeight: 500 }}>Country:</span> {viewingFamilyMember.country || '-'}</div>
                      <div><span style={{ color: '#1c9c6e', fontWeight: 500 }}>Pin:</span> {viewingFamilyMember.pincode || '-'}</div>
                    </div>
                  </>
                )
              }
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                onClick={() => setViewingFamilyMember(null)}
                style={{ backgroundColor: '#1c9c6e', color: 'white', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
