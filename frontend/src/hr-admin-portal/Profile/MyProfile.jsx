import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Employee/Information/Employee-profile/EmployeeProfileDetail.css';

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

const DetailItem = ({ label, name, value, link, isEditing, onChange, onFileChange, type="text", options }) => (
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
        ) : type === 'file' ? (
          <input 
            className="emp-input" 
            type="file" 
            name={name} 
            accept=".jpg, .jpeg, .png"
            onChange={onFileChange} 
            style={{ marginTop: '4px', padding: '6px', fontSize: '14px', width: '100%', maxWidth: '250px' }} 
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
        link ? <a href={link}>{value}</a> : type === 'file' ? (value ? 'Uploaded' : 'No Photo') : (value || '-')
      )}
    </span>
  </div>
);

export default function MyProfile({ employeeId, isInline = false }) {
  const { id } = useParams();
  const fetchId = employeeId || id || 1;
  const [employee, setEmployee] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [managerOptions, setManagerOptions] = useState(['Select Manager']);

  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/${fetchId}`)
      .then(res => res.json())
      .then(data => {
        if (data.employee) {
          setEmployee(data.employee);
        }
      })
      .catch(err => console.error('Error fetching employee:', err));

    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) {
          const names = data.employees.map(e => `${e.first_name || ''} ${e.last_name || ''} (${e.emp_code || ''})`.trim());
          setManagerOptions(['Select Manager', ...names]);
        }
      });
  }, []);

  if (!employee) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="emp-spinner"></div>
      </div>
    );
  }

  const handleEdit = (sectionId) => {
    setEditingSection(sectionId);
    setEditFormData({ ...employee });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const data = await response.json();
      if (response.ok) {
        setEmployee(data.employee);
        setEditingSection(null);
        setEditFormData({});
        setNotification({ show: true, type: 'success', message: 'Profile updated successfully!' });
      } else {
        throw new Error(data.error || 'Failed to update profile');
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

  const renderProfileContent = () => (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', overflowY: 'auto' }}>

      <div className="emp-detail-container" style={{ margin: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        
        {/* ── Banner ── */}
            <div className="emp-detail-banner">
              <div className="emp-detail-banner-left">
                <div className="emp-detail-avatar-wrapper">
                  {employee.profile_image ? (
                     <img src={employee.profile_image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <div className="emp-detail-banner-info">
                  <h2 className="emp-detail-name">{employee.first_name} {employee.last_name}</h2>
                  <p className="emp-detail-id">{employee.emp_code}</p>
                </div>
              </div>
            </div>

            {/* ── Personal Details ── */}
            <div className="emp-detail-section">
              <SectionHeader title="Personal Details" isEditing={isSecEdit('personal')} onEdit={() => handleEdit('personal')} onSave={handleSave} onCancel={handleCancel} />
              <div className="emp-detail-grid cols-3">
                <DetailItem label="First Name" name="first_name" value={currentData.first_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Middle Name" name="middle_name" value={currentData.middle_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Last Name" name="last_name" value={currentData.last_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Email" name="email" value={currentData.email} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Mobile Number" name="mobile" value={currentData.mobile} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Date of Birth" name="dob" type="date" value={currentData.dob} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Gender" name="gender" value={currentData.gender} isEditing={isSecEdit('personal')} onChange={handleChange} options={['Select Gender', 'Male', 'Female', 'Other']} />
                <DetailItem label="Blood Group" name="blood_group" value={currentData.blood_group} isEditing={isSecEdit('personal')} onChange={handleChange} options={['Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                <DetailItem label="Marital Status" name="marital_status" value={currentData.marital_status} isEditing={isSecEdit('personal')} onChange={handleChange} options={['Select Marital Status', 'Single', 'Married']} />
                <DetailItem label="Father's Name" name="father_name" value={currentData.father_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Spouse's Name" name="spouse_name" value={currentData.spouse_name} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Nationality" name="nationality" value={currentData.nationality} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="Aadhaar Number" name="aadhaar_number" value={currentData.aadhaar_number} isEditing={isSecEdit('personal')} onChange={handleChange} />
                <DetailItem label="PAN Number" name="pan_number" value={currentData.pan_number} isEditing={isSecEdit('personal')} onChange={handleChange} />
              </div>
            </div>

            {/* ── Joining Details ── */}
            <div className="emp-detail-section">
              <SectionHeader title="Joining Details" isEditing={isSecEdit('joining')} onEdit={() => handleEdit('joining')} onSave={handleSave} onCancel={handleCancel} />
              <div className="emp-detail-grid cols-3">
                <DetailItem label="Date Of Join" name="doj" type="date" value={currentData.doj} isEditing={isSecEdit('joining')} onChange={handleChange} />
                <DetailItem label="Confirmation Date" name="confirmation_date" type="date" value={currentData.confirmation_date} isEditing={isSecEdit('joining')} onChange={handleChange} />
                <DetailItem label="Status" name="status" value={currentData.status} isEditing={isSecEdit('joining')} onChange={handleChange} options={['Select Status', 'Probation', 'Confirmed']} />
                <DetailItem label="Probation Period" name="probation_period" type="number" value={currentData.probation_period} isEditing={isSecEdit('joining')} onChange={handleChange} />
                <DetailItem label="Notice Period" name="notice_period" type="number" value={currentData.notice_period} isEditing={isSecEdit('joining')} onChange={handleChange} />
              </div>
            </div>

            {/* ── Current Position ── */}
            <div className="emp-detail-section">
              <SectionHeader title="Current Position" isEditing={isSecEdit('position')} onEdit={() => handleEdit('position')} onSave={handleSave} onCancel={handleCancel} />
              <div className="emp-detail-grid cols-3">
                <DetailItem label="Division" name="division" value={currentData.division} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Cost Center" name="cost_center" value={currentData.cost_center} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Grade" name="grade" value={currentData.grade} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Designation" name="designation" value={currentData.designation} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Location" name="location" value={currentData.location} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Department" name="department" value={currentData.department} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Shift" name="shift" value={currentData.shift} isEditing={isSecEdit('position')} onChange={handleChange} />
                <DetailItem label="Reporting To" name="reporting_to" value={currentData.reporting_to} isEditing={isSecEdit('position')} onChange={handleChange} options={managerOptions} />
              </div>
            </div>

            {/* ── Additional Details ── */}
            <div className="emp-detail-section">
              <SectionHeader title="Additional Details" isEditing={isSecEdit('additional')} onEdit={() => handleEdit('additional')} onSave={handleSave} onCancel={handleCancel} />
              <div className="emp-detail-grid cols-3">
                <DetailItem label="Hobbies" name="hobbies" value={currentData.hobbies} isEditing={isSecEdit('additional')} onChange={handleChange} />
                <DetailItem label="Languages Known" name="languages_known" value={currentData.languages_known} isEditing={isSecEdit('additional')} onChange={handleChange} />
                <DetailItem label="Resignation Date" name="resignation_date" type="date" value={currentData.resignation_date} isEditing={isSecEdit('additional')} onChange={handleChange} />
                <DetailItem label="Last Working Date" name="last_working_date" type="date" value={currentData.last_working_date} isEditing={isSecEdit('additional')} onChange={handleChange} />
                <DetailItem label="Separation Reason" name="separation_reason" value={currentData.separation_reason} isEditing={isSecEdit('additional')} onChange={handleChange} />
              </div>
            </div>

            {/* ── Bank & PF Details ── */}
            <div className="emp-detail-section">
              <SectionHeader title="Bank & PF Details" isEditing={isSecEdit('bank')} onEdit={() => handleEdit('bank')} onSave={handleSave} onCancel={handleCancel} />
              <div className="emp-detail-grid cols-3">
                <DetailItem label="Bank Name" name="bank_name" value={currentData.bank_name} isEditing={isSecEdit('bank')} onChange={handleChange} />
                <DetailItem label="Account Number" name="account_number" value={currentData.account_number} isEditing={isSecEdit('bank')} onChange={handleChange} />
                <DetailItem label="IFSC Code" name="ifsc_code" value={currentData.ifsc_code} isEditing={isSecEdit('bank')} onChange={handleChange} />
                <DetailItem label="PF Number" name="pf_number" value={currentData.pf_number} isEditing={isSecEdit('bank')} onChange={handleChange} />
                <DetailItem label="UAN Number" name="uan_number" value={currentData.uan_number} isEditing={isSecEdit('bank')} onChange={handleChange} />
                <DetailItem label="ESI Number" name="esi_number" value={currentData.esi_number} isEditing={isSecEdit('bank')} onChange={handleChange} />
              </div>
            </div>

            {/* ── Notification Modal ── */}
        {notification.show && (
          <div className="emp-notification-overlay">
            <div className="emp-notification-modal">
              <h3 className="emp-notification-title">{notification.type === 'success' ? 'Success' : 'Error'}</h3>
              <p className="emp-notification-message">{notification.message}</p>
              <button className="emp-btn emp-btn-primary" onClick={() => setNotification({ show: false, type: '', message: '' })}>Okay</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="emp-main-content" style={{ padding: 0 }}>
        {renderProfileContent()}
      </div>
    );
  }

  return (
    <div className="emp-page-container">
      <EmployeeSidebar />
      <main className="emp-main-content">
        {renderProfileContent()}
      </main>
    </div>
  );
}
