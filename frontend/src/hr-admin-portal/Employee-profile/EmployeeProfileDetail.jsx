import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeProfileDetail.css';

const EditIcon = ({ onClick }) => (
  <svg onClick={onClick} className="emp-detail-edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const SectionHeader = ({ title, isEditing, onEdit, onSave, onCancel }) => (
  <div className="emp-detail-section-header">
    <h3 className="emp-detail-section-title">{title}</h3>
    {!isEditing ? (
      <EditIcon onClick={onEdit} />
    ) : (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onSave} className="emp-btn emp-btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Save</button>
        <button onClick={onCancel} className="emp-btn emp-btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>Cancel</button>
      </div>
    )}
  </div>
);

const SubSectionHeader = ({ title }) => (
  <div className="emp-detail-subsection-header">
    <span>{title}</span>
  </div>
);

const DetailItem = ({ label, name, value, link, isEditing, onChange, type="text", options }) => (
  <div className="emp-detail-item">
    <span className="emp-detail-label">{label}</span>
    <span className="emp-detail-value">
      {isEditing ? (
        options ? (
          <select
            className="emp-input"
            name={name}
            value={value || ''}
            onChange={onChange}
            style={{ marginTop: '4px', padding: '6px', fontSize: '14px', width: '100%', maxWidth: '250px' }}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.startsWith('Select') ? '' : opt}>{opt}</option>
            ))}
          </select>
        ) : type === 'date' ? (
          <DatePicker
            className="emp-input"
            selected={value ? new Date(value) : null}
            onChange={(date) => {
              let formattedDate = '';
              if (date) {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                formattedDate = `${y}-${m}-${d}`;
              }
              onChange({ target: { name, value: formattedDate } });
            }}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            placeholderText="Select date"
          />
        ) : (
          <input 
            className="emp-input" 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            style={{ marginTop: '4px', padding: '6px', fontSize: '14px', width: '100%', maxWidth: '250px' }} 
          />
        )
      ) : (
        link ? <a href={link}>{value}</a> : (value || '-')
      )}
    </span>
  </div>
);

export default function EmployeeProfileDetail({ employee: initialEmployee }) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [managerOptions, setManagerOptions] = useState(['Select Manager']);

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) {
          const names = data.employees.map(e => `${e.first_name || ''} ${e.last_name || ''} (${e.emp_code || ''})`.trim());
          setManagerOptions(['Select Manager', ...names]);
        }
      })
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  useEffect(() => {
    setEmployee(initialEmployee);
  }, [initialEmployee]);

  if (!employee) return null;

  const handleEdit = (sectionId) => {
    setEditingSection(sectionId);
    setEditFormData({ ...employee });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Failed to update employee (Server returned non-JSON)');
      }

      if (response.ok) {
        setEmployee(data.employee);
        setEditingSection(null);
        setEditFormData({});
        setNotification({ show: true, type: 'success', message: 'Employee updated successfully!' });
      } else {
        throw new Error(data.error || 'Failed to update employee');
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, type: 'error', message: 'Failed to save changes: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const isSecEdit = (sectionId) => editingSection === sectionId;
  const currentData = editingSection ? editFormData : employee;

  return (
    <div className="emp-detail-container">
      {/* ── Banner ── */}
      <div className="emp-detail-banner">
        <div className="emp-detail-banner-left">
          <div className="emp-detail-avatar-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="emp-detail-banner-info">
            <h2 className="emp-detail-name">{employee.first_name} {employee.last_name}</h2>
            <p className="emp-detail-id">{employee.emp_code}</p>
          </div>
        </div>
      </div>

      {/* ── Basic Employee Information ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Basic Employee Information" 
          isEditing={isSecEdit('basic')} 
          onEdit={() => handleEdit('basic')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        <div className="emp-detail-grid">
          <DetailItem label="Title" name="title" value={currentData.title} isEditing={isSecEdit('basic')} onChange={handleChange} options={['Select', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']} />
          <DetailItem label="First Name" name="first_name" value={currentData.first_name} isEditing={isSecEdit('basic')} onChange={handleChange} />
          <DetailItem label="Middle Name" name="middle_name" value={currentData.middle_name} isEditing={isSecEdit('basic')} onChange={handleChange} />
          <DetailItem label="Last Name" name="last_name" value={currentData.last_name} isEditing={isSecEdit('basic')} onChange={handleChange} />
          <DetailItem label="Gender" name="gender" value={currentData.gender} isEditing={isSecEdit('basic')} onChange={handleChange} options={['Select', 'Male', 'Female', 'Other']} />
          <DetailItem label="Email" name="email" value={currentData.email} isEditing={isSecEdit('basic')} onChange={handleChange} link={!isSecEdit('basic') && currentData.email ? `mailto:${currentData.email}` : undefined} />
          <DetailItem label="Mobile" name="mobile" value={currentData.mobile} isEditing={isSecEdit('basic')} onChange={handleChange} />
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Personal Information" 
          isEditing={isSecEdit('personal')} 
          onEdit={() => handleEdit('personal')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="DOB" name="dob" type="date" value={currentData.dob} isEditing={isSecEdit('personal')} onChange={handleChange} />
          <DetailItem label="Blood Group" name="blood_group" value={currentData.blood_group} isEditing={isSecEdit('personal')} onChange={handleChange} options={['Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
          <DetailItem label="Marital Status" name="marital_status" value={currentData.marital_status} isEditing={isSecEdit('personal')} onChange={handleChange} options={['Select Marital Status', 'Single', 'Married', 'Divorced', 'Widowed']} />
          <DetailItem label="Father's Name" name="father_name" value={currentData.father_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
          <DetailItem label="Spouse's Name" name="spouse_name" value={currentData.spouse_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
          <DetailItem label="Nationality" name="nationality" value={currentData.nationality} isEditing={isSecEdit('personal')} onChange={handleChange} />
          <DetailItem label="Aadhaar Number" name="aadhaar_number" value={currentData.aadhaar_number} isEditing={isSecEdit('personal')} onChange={handleChange} />
          <DetailItem label="PAN Number" name="pan_number" value={currentData.pan_number} isEditing={isSecEdit('personal')} onChange={handleChange} />
        </div>
      </div>

      {/* ── Joining Details ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Joining Details" 
          isEditing={isSecEdit('joining')} 
          onEdit={() => handleEdit('joining')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="Date Of Join" name="doj" type="date" value={currentData.doj} isEditing={isSecEdit('joining')} onChange={handleChange} />
          <DetailItem label="Confirmation Date" name="confirmation_date" type="date" value={currentData.confirmation_date} isEditing={isSecEdit('joining')} onChange={handleChange} />
          <DetailItem label="Status" name="status" value={currentData.status} isEditing={isSecEdit('joining')} onChange={handleChange} options={['Select Status', 'Probation', 'Confirmed']} />
          <DetailItem label="Probation Period" name="probation_period" type="number" value={currentData.probation_period} isEditing={isSecEdit('joining')} onChange={handleChange} />
          <DetailItem label="Notice Period" name="notice_period" type="number" value={currentData.notice_period} isEditing={isSecEdit('joining')} onChange={handleChange} />
          <DetailItem label="Current Experience in Year" name="current_experience_in_year" type="number" value={currentData.current_experience_in_year} isEditing={isSecEdit('joining')} onChange={handleChange} />
          <DetailItem label="Total Experience" name="total_experience" value={currentData.total_experience} isEditing={isSecEdit('joining')} onChange={handleChange} />
        </div>
      </div>

      {/* ── Current Position ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Current Position" 
          isEditing={isSecEdit('position')} 
          onEdit={() => handleEdit('position')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="Department" name="department" value={currentData.department} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Designation" name="designation" value={currentData.designation} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Location" name="location" value={currentData.location} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Reporting To" name="reporting_to" value={currentData.reporting_to} isEditing={isSecEdit('position')} onChange={handleChange} options={managerOptions} />
          <DetailItem label="Grade" name="grade" value={currentData.grade} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Division" name="division" value={currentData.division} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Cost Center" name="cost_center" value={currentData.cost_center} isEditing={isSecEdit('position')} onChange={handleChange} />
          <DetailItem label="Shift" name="shift" value={currentData.shift} isEditing={isSecEdit('position')} onChange={handleChange} />
        </div>
      </div>

      {/* ── Previous Work Experience ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Previous Work Experience" 
          isEditing={isSecEdit('experience')} 
          onEdit={() => handleEdit('experience')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="Organization" name="prev_organization" value={currentData.prev_organization} isEditing={isSecEdit('experience')} onChange={handleChange} />
          <DetailItem label="Designation" name="prev_designation" value={currentData.prev_designation} isEditing={isSecEdit('experience')} onChange={handleChange} />
          <DetailItem label="Location" name="prev_location" value={currentData.prev_location} isEditing={isSecEdit('experience')} onChange={handleChange} />
          <DetailItem label="From" name="prev_from_date" type="date" value={currentData.prev_from_date} isEditing={isSecEdit('experience')} onChange={handleChange} />
          <DetailItem label="To" name="prev_to_date" type="date" value={currentData.prev_to_date} isEditing={isSecEdit('experience')} onChange={handleChange} />
        </div>
      </div>

      {/* ── Address Details ── */}
      <div className="emp-detail-section">
        <SectionHeader 
          title="Address Details" 
          isEditing={isSecEdit('address')} 
          onEdit={() => handleEdit('address')} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
        
        <div className="emp-detail-subsection">
          <SubSectionHeader title="Present" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" name="present_name" value={currentData.present_name} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Address" name="present_address" value={currentData.present_address} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="City" name="present_city" value={currentData.present_city} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Country" name="present_country" value={currentData.present_country} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Pincode" name="present_pincode" value={currentData.present_pincode} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Phone" name="present_phone" value={currentData.present_phone} isEditing={isSecEdit('address')} onChange={handleChange} />
          </div>
        </div>

        <div className="emp-detail-subsection">
          <SubSectionHeader title="Permanent" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" name="permanent_name" value={currentData.permanent_name} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Address" name="permanent_address" value={currentData.permanent_address} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="City" name="permanent_city" value={currentData.permanent_city} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Country" name="permanent_country" value={currentData.permanent_country} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Pincode" name="permanent_pincode" value={currentData.permanent_pincode} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Phone" name="permanent_phone" value={currentData.permanent_phone} isEditing={isSecEdit('address')} onChange={handleChange} />
          </div>
        </div>

        <div className="emp-detail-subsection">
          <SubSectionHeader title="Emergency Contact" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" name="emergency_name" value={currentData.emergency_name} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Relationship" name="emergency_relationship" value={currentData.emergency_relationship} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Address" name="emergency_address" value={currentData.emergency_address} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Country" name="emergency_country" value={currentData.emergency_country} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Pincode" name="emergency_pincode" value={currentData.emergency_pincode} isEditing={isSecEdit('address')} onChange={handleChange} />
            <DetailItem label="Phone" name="emergency_phone" value={currentData.emergency_phone} isEditing={isSecEdit('address')} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* ── Notification Modal ── */}
      {notification.show && (
        <div className="emp-notification-overlay">
          <div className="emp-notification-modal">
            <div className={`emp-notification-icon ${notification.type}`}>
              {notification.type === 'success' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <h3 className="emp-notification-title">
              {notification.type === 'success' ? 'Success' : 'Error'}
            </h3>
            <p className="emp-notification-message">{notification.message}</p>
            <button 
              className="emp-btn emp-btn-primary" 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
