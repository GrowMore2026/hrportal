import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeSidebar from './EmployeeSidebar';
import './EmployeeProfile.css';

// SVG for Edit Icon
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

export default function EmployeeProfile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    emp_code: '',
    first_name: '',
    dob: '',
    aadhaar_number: '',
    gender: '',
    reporting_manager: '',
    status: '',
    doj: '',
    probation_period: '',
    confirmation_date: '',
    email: '',
    mobile: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    father_name: '',
    spouse_name: '',
    division: '',
    cost_center: '',
    grade: '',
    designation: '',
    location: '',
    department: '',
    shift: '',
    pan_number: '',
    include_pf: true,
    include_esi: false,
    include_lwf: false,
    pf_number: '',
    uan_number: '',
    pf_excess_contribution: 'employee_and_employer',
    payment_type: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      setNotification({ show: true, type: 'success', message: 'Employee created successfully!' });
      // Reset form on success
      setCurrentStep(1);
      setFormData({
        emp_code: '', first_name: '', dob: '', aadhaar_number: '', gender: '', reporting_manager: '', status: '', doj: '', probation_period: '', confirmation_date: '', email: '', mobile: '', emergency_contact_name: '', emergency_contact_number: '', father_name: '', spouse_name: '', division: '', cost_center: '', grade: '', designation: '', location: '', department: '', shift: '', pan_number: '', include_pf: true, include_esi: false, include_lwf: false, pf_number: '', uan_number: '', pf_excess_contribution: 'employee_and_employer', payment_type: ''
      });
    } catch (error) {
      console.error(error);
      setNotification({ show: true, type: 'error', message: 'Error creating employee: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="emp-page-layout">
      {/* ── Sidebar ── */}
      <EmployeeSidebar />
      {/* ── Main Content ── */}
      <main className="emp-main-content" style={{ padding: '32px' }}>
        
        {/* Progress Header */}
        <div className="emp-add-header">
          <div className="emp-add-progress">
            {[
              { id: 1, label: 'Basic Information' },
              { id: 2, label: 'Employee Position' },
              { id: 3, label: 'Statutory Info' },
              { id: 4, label: 'Payment Mode' },
            ].map(step => (
              <div key={step.id} className={`emp-progress-step ${currentStep >= step.id ? 'active' : ''}`}>
                <div className="emp-step-circle">{step.id}</div>
                <span className="emp-step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="emp-add-form-container">
          <h2 className="emp-add-form-title">
            {currentStep === 1 && "Step 1: Basic Information"}
            {currentStep === 2 && "Step 2: Employee Position"}
            {currentStep === 3 && "Step 3: Statutory Info"}
            {currentStep === 4 && "Step 4: Payment Mode"}
          </h2>
          
          {currentStep === 1 && (
            <form className="emp-add-grid">
              {/* Left Column */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">Employee Number Series</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select">
                      <option value="">Select Series</option>
                      <option value="GM">GM</option>
                    </select>
                    <span className="emp-form-hint">Manage Employee Number Series</span>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Employee No</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="emp_code" value={formData.emp_code} onChange={handleChange} placeholder="e.g. GM001" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Full Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Birth</label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" name="dob" value={formData.dob} onChange={handleChange} />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Aadhaar Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="12-digit Aadhaar" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Gender</label>
                  <div className="emp-form-input-wrap emp-radio-group">
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" value="Others" checked={formData.gender === 'Others'} onChange={handleChange} /> Others
                    </label>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Reporting Manager</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="reporting_manager" value={formData.reporting_manager} onChange={handleChange}>
                      <option value="">Select Manager</option>
                      <option value="manager1">Juhi Thakwani [GM008]</option>
                    </select>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Status</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="">Select Status</option>
                      <option value="probation">Probation</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Joining <span className="emp-required">*</span></label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" name="doj" value={formData.doj} onChange={handleChange} />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">Probation Period</label>
                  <div className="emp-form-input-wrap emp-inline-input">
                    <input type="number" className="emp-input" name="probation_period" value={formData.probation_period} onChange={handleChange} placeholder="0" />
                    <span className="emp-inline-text">Days</span>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Confirmation Date</label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" name="confirmation_date" value={formData.confirmation_date} onChange={handleChange} />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Email</label>
                  <div className="emp-form-input-wrap">
                    <input type="email" className="emp-input" name="email" value={formData.email} onChange={handleChange} placeholder="work@company.com" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Mobile Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="tel" className="emp-input" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Emergency Contact Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} placeholder="Contact Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Emergency Contact Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="tel" className="emp-input" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange} placeholder="Contact Number" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Father's name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="father_name" value={formData.father_name} onChange={handleChange} placeholder="Father's Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Spouse Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="spouse_name" value={formData.spouse_name} onChange={handleChange} placeholder="Spouse Name" />
                  </div>
                </div>

              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form className="emp-add-grid">
              {/* Left Column */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">Division</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="division" value={formData.division} onChange={handleChange}>
                      <option value="">Select Division</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Cost Center</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="cost_center" value={formData.cost_center} onChange={handleChange}>
                      <option value="">Select Cost Center</option>
                      <option value="CC001">CC001</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Grade</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="grade" value={formData.grade} onChange={handleChange}>
                      <option value="">Select Grade</option>
                      <option value="A1">A1</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Designation</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="designation" value={formData.designation} onChange={handleChange}>
                      <option value="">Select Designation</option>
                      <option value="Software Engineer">Software Engineer</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div className="emp-form-group">
                  <label className="emp-form-label">Location</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="location" value={formData.location} onChange={handleChange}>
                      <option value="">Select Location</option>
                      <option value="Head Office">Head Office</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Department</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="department" value={formData.department} onChange={handleChange}>
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Shifts</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }} name="shift" value={formData.shift} onChange={handleChange}>
                      <option value="">Select Shifts</option>
                      <option value="General">General</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form className="emp-add-grid" style={{ gridTemplateColumns: '1fr' }}>
              {/* Single Column for Statutory Info */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">PAN Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="pan_number" value={formData.pan_number} onChange={handleChange} placeholder="PAN Number" style={{ maxWidth: '400px' }} />
                  </div>
                </div>

                <div className="emp-form-group">
                  <div className="emp-checkbox-group">
                    <label className="emp-checkbox-label">
                      <input type="checkbox" name="include_pf" checked={formData.include_pf} onChange={handleChange} /> Include PF
                    </label>
                    <label className="emp-checkbox-label">
                      <input type="checkbox" name="include_esi" checked={formData.include_esi} onChange={handleChange} /> Include ESI
                    </label>
                    <label className="emp-checkbox-label">
                      <input type="checkbox" name="include_lwf" checked={formData.include_lwf} onChange={handleChange} /> Include LWF
                    </label>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">PF Number</label>
                  <div className="emp-form-input-wrap" style={{ maxWidth: '400px' }}>
                    <input type="text" className="emp-input" name="pf_number" value={formData.pf_number} onChange={handleChange} placeholder="e.g. HR/FBD/0003256/000/0000125" />
                    <span className="emp-form-hint" style={{ color: '#9ca3af', fontWeight: 'normal', fontSize: '12px', marginTop: '8px', cursor: 'default' }}>
                      Format : (Region Code/Office Code/Est Code/Extn No/Member Acc No) Example HR/FBD/0003256/000/0000125.
                    </span>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">UAN Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" name="uan_number" value={formData.uan_number} onChange={handleChange} placeholder="UAN Number" style={{ maxWidth: '400px' }} />
                  </div>
                </div>

                <div className="emp-form-group" style={{ marginTop: '16px' }}>
                  <label className="emp-form-label">PF Excess Contribution</label>
                  <div className="emp-form-input-wrap emp-radio-group-vertical">
                    <label className="emp-radio-label">
                      <input type="radio" name="pf_excess_contribution" value="employee_and_employer" checked={formData.pf_excess_contribution === 'employee_and_employer'} onChange={handleChange} /> Employee & Employer contribution - 12% with in wage ceiling (Max Rs.1800)
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="pf_excess_contribution" value="employee_only" checked={formData.pf_excess_contribution === 'employee_only'} onChange={handleChange} /> Employee contribution - 12% over and above wage ceiling (In excess to Rs.1800)
                    </label>
                  </div>
                </div>

              </div>
            </form>
          )}

          {currentStep === 4 && (
            <form className="emp-add-grid" style={{ gridTemplateColumns: '1fr' }}>
              {/* Single Column for Payment Mode */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">Payment Type</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="payment_type" value={formData.payment_type} onChange={handleChange} style={{ maxWidth: '400px' }}>
                      <option value="">---Select---</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                </div>

              </div>
            </form>
          )}

          {/* Form Actions */}
          <div className="emp-form-actions">
            {currentStep > 1 && (
              <button type="button" className="emp-btn emp-btn-secondary" onClick={handleBack} style={{ marginRight: 'auto' }} disabled={isSubmitting}>Back</button>
            )}
            <button type="button" className="emp-btn emp-btn-secondary" onClick={() => setCurrentStep(1)} disabled={isSubmitting}>Cancel</button>
            <button type="button" className="emp-btn emp-btn-primary" onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (currentStep < 4 ? "Next" : "Submit")}
            </button>
          </div>

        </div>

        {/* Custom Notification Modal */}
        {notification.show && (
          <div className="emp-notification-overlay">
            <div className="emp-notification-modal">
              <div className={`emp-notification-icon ${notification.type}`}>
                {notification.type === 'success' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                )}
              </div>
              <h3 className="emp-notification-title">
                {notification.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="emp-notification-message">{notification.message}</p>
              <button 
                className="emp-btn emp-btn-primary emp-notification-btn"
                onClick={() => setNotification({ show: false, type: '', message: '' })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
