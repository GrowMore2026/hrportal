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
  const [employeesList, setEmployeesList] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) setEmployeesList(data.employees);
      })
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  const initialFormState = {
    emp_code: '', first_name: '', middle_name: '', last_name: '', title: '',
    dob: '', aadhaar_number: '', gender: '', blood_group: '', marital_status: '', nationality: '', profile_image: '',
    father_name: '', spouse_name: '',
    status: '', doj: '', probation_period: '', confirmation_date: '', notice_period: '', current_experience_in_year: '', total_experience: '',
    email: '', mobile: '',
    division: '', cost_center: '', grade: '', designation: '', location: '', department: '', shift: '', reporting_to: '',
    prev_organization: '', prev_designation: '', prev_location: '', prev_from_date: '', prev_to_date: '',
    present_name: '', present_address: '', present_city: '', present_country: '', present_pincode: '', present_phone: '',
    permanent_name: '', permanent_address: '', permanent_city: '', permanent_country: '', permanent_pincode: '', permanent_phone: '',
    emergency_name: '', emergency_relationship: '', emergency_address: '', emergency_country: '', emergency_pincode: '', emergency_phone: '',
    pan_number: '', include_pf: true, include_esi: false, include_lwf: false, pf_number: '', uan_number: '', pf_excess_contribution: 'employee_and_employer',
    payment_type: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
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
      setCurrentStep(1);
      setFormData(initialFormState);
    } catch (error) {
      console.error(error);
      setNotification({ show: true, type: 'error', message: 'Error creating employee: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="emp-page-layout">
      <EmployeeSidebar />
      <main className="emp-main-content" style={{ padding: '32px' }}>
        
        <div className="emp-add-header">
          <div className="emp-add-progress">
            {[
              { id: 1, label: 'Basic Info' },
              { id: 2, label: 'Position' },
              { id: 3, label: 'Prev Experience' },
              { id: 4, label: 'Address' },
              { id: 5, label: 'Statutory' },
              { id: 6, label: 'Payment Mode' },
            ].map(step => (
              <div key={step.id} className={`emp-progress-step ${currentStep >= step.id ? 'active' : ''}`}>
                <div className="emp-step-circle">{step.id}</div>
                <span className="emp-step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="emp-add-form-container">
          <h2 className="emp-add-form-title">
            {currentStep === 1 && "Step 1: Basic Information"}
            {currentStep === 2 && "Step 2: Employee Position"}
            {currentStep === 3 && "Step 3: Previous Work Experience"}
            {currentStep === 4 && "Step 4: Address Details"}
            {currentStep === 5 && "Step 5: Statutory Info"}
            {currentStep === 6 && "Step 6: Payment Mode"}
          </h2>
          
          {currentStep === 1 && (
            <form className="emp-add-grid">
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">Employee Number Series</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select"><option value="">Select Series</option><option value="GM">GM</option></select>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Employee No</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="emp_code" value={formData.emp_code} onChange={handleChange} placeholder="e.g. GM001" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Title</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="title" value={formData.title} onChange={handleChange} placeholder="Mr. / Ms." /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">First Name</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Middle Name</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Last Name</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Birth</label>
                  <div className="emp-form-input-wrap"><input type="date" className="emp-input" name="dob" value={formData.dob} onChange={handleChange} /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Aadhaar Number</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="12-digit Aadhaar" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Gender</label>
                  <div className="emp-form-input-wrap emp-radio-group">
                    <label className="emp-radio-label"><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
                    <label className="emp-radio-label"><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
                    <label className="emp-radio-label"><input type="radio" name="gender" value="Others" checked={formData.gender === 'Others'} onChange={handleChange} /> Others</label>
                  </div>
                </div>
              </div>
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">Blood Group</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="blood_group" value={formData.blood_group} onChange={handleChange}>
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Marital Status</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="marital_status" value={formData.marital_status} onChange={handleChange}>
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Nationality</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Indian" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Email</label>
                  <div className="emp-form-input-wrap"><input type="email" className="emp-input" name="email" value={formData.email} onChange={handleChange} placeholder="work@company.com" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Mobile Number</label>
                  <div className="emp-form-input-wrap"><input type="tel" className="emp-input" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Father's Name</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="father_name" value={formData.father_name} onChange={handleChange} placeholder="Father's Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Spouse Name</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="spouse_name" value={formData.spouse_name} onChange={handleChange} placeholder="Spouse Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Profile Image Upload</label>
                  <div className="emp-form-input-wrap">
                    <input 
                      type="file" 
                      className="emp-input" 
                      name="profile_image" 
                      accept=".jpg, .jpeg, .png" 
                      onChange={handleFileChange} 
                      style={{ padding: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form className="emp-add-grid">
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Joining <span className="emp-required">*</span></label>
                  <div className="emp-form-input-wrap"><input type="date" className="emp-input" name="doj" value={formData.doj} onChange={handleChange} /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Confirmation Date</label>
                  <div className="emp-form-input-wrap"><input type="date" className="emp-input" name="confirmation_date" value={formData.confirmation_date} onChange={handleChange} /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Status</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="">Select Status</option><option value="Probation">Probation</option><option value="Confirmed">Confirmed</option>
                    </select>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Probation Period</label>
                  <div className="emp-form-input-wrap emp-inline-input">
                    <input type="number" className="emp-input" name="probation_period" value={formData.probation_period} onChange={handleChange} placeholder="0" />
                    <span className="emp-inline-text">Days</span>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Notice Period</label>
                  <div className="emp-form-input-wrap emp-inline-input">
                    <input type="number" className="emp-input" name="notice_period" value={formData.notice_period} onChange={handleChange} placeholder="0" />
                    <span className="emp-inline-text">Days</span>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Current Experience (Years)</label>
                  <div className="emp-form-input-wrap"><input type="number" step="0.1" className="emp-input" name="current_experience_in_year" value={formData.current_experience_in_year} onChange={handleChange} placeholder="0.5" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Total Experience</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="total_experience" value={formData.total_experience} onChange={handleChange} placeholder="2 Years" /></div>
                </div>
              </div>
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">Reporting To</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select" name="reporting_to" value={formData.reporting_to} onChange={handleChange}>
                      <option value="">Select Manager</option>
                      {employeesList.map(emp => (
                        <option key={emp.id} value={`${emp.first_name || ''} ${emp.last_name || ''} (${emp.emp_code || ''})`.trim()}>
                          {emp.first_name} {emp.last_name} ({emp.emp_code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Division</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="division" value={formData.division} onChange={handleChange} placeholder="Division" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Cost Center</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="cost_center" value={formData.cost_center} onChange={handleChange} placeholder="Cost Center" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Grade</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Designation</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Location</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="location" value={formData.location} onChange={handleChange} placeholder="Location" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Department</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="department" value={formData.department} onChange={handleChange} placeholder="Department" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Shifts</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="shift" value={formData.shift} onChange={handleChange} placeholder="Shift" /></div>
                </div>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form className="emp-add-grid">
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">Previous Organization</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="prev_organization" value={formData.prev_organization} onChange={handleChange} placeholder="Company Name" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Designation</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="prev_designation" value={formData.prev_designation} onChange={handleChange} placeholder="Designation" /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">Location</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="prev_location" value={formData.prev_location} onChange={handleChange} placeholder="Location" /></div>
                </div>
              </div>
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">From Date</label>
                  <div className="emp-form-input-wrap"><input type="date" className="emp-input" name="prev_from_date" value={formData.prev_from_date} onChange={handleChange} /></div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">To Date</label>
                  <div className="emp-form-input-wrap"><input type="date" className="emp-input" name="prev_to_date" value={formData.prev_to_date} onChange={handleChange} /></div>
                </div>
              </div>
            </form>
          )}

          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '14px' }}>Present Address</h3>
                <div className="emp-add-grid">
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Name</label><input type="text" className="emp-input" name="present_name" value={formData.present_name} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Address</label><input type="text" className="emp-input" name="present_address" value={formData.present_address} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">City</label><input type="text" className="emp-input" name="present_city" value={formData.present_city} onChange={handleChange} /></div>
                  </div>
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Country</label><input type="text" className="emp-input" name="present_country" value={formData.present_country} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Pincode</label><input type="text" className="emp-input" name="present_pincode" value={formData.present_pincode} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Phone</label><input type="text" className="emp-input" name="present_phone" value={formData.present_phone} onChange={handleChange} /></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '14px' }}>Permanent Address</h3>
                <div className="emp-add-grid">
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Name</label><input type="text" className="emp-input" name="permanent_name" value={formData.permanent_name} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Address</label><input type="text" className="emp-input" name="permanent_address" value={formData.permanent_address} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">City</label><input type="text" className="emp-input" name="permanent_city" value={formData.permanent_city} onChange={handleChange} /></div>
                  </div>
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Country</label><input type="text" className="emp-input" name="permanent_country" value={formData.permanent_country} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Pincode</label><input type="text" className="emp-input" name="permanent_pincode" value={formData.permanent_pincode} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Phone</label><input type="text" className="emp-input" name="permanent_phone" value={formData.permanent_phone} onChange={handleChange} /></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '14px' }}>Emergency Contact</h3>
                <div className="emp-add-grid">
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Name</label><input type="text" className="emp-input" name="emergency_name" value={formData.emergency_name} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Relationship</label><input type="text" className="emp-input" name="emergency_relationship" value={formData.emergency_relationship} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Address</label><input type="text" className="emp-input" name="emergency_address" value={formData.emergency_address} onChange={handleChange} /></div>
                  </div>
                  <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="emp-form-group"><label className="emp-form-label">Country</label><input type="text" className="emp-input" name="emergency_country" value={formData.emergency_country} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Pincode</label><input type="text" className="emp-input" name="emergency_pincode" value={formData.emergency_pincode} onChange={handleChange} /></div>
                    <div className="emp-form-group"><label className="emp-form-label">Phone</label><input type="text" className="emp-input" name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <form className="emp-add-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="emp-form-group">
                  <label className="emp-form-label">PAN Number</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="pan_number" value={formData.pan_number} onChange={handleChange} placeholder="PAN Number" style={{ maxWidth: '400px' }} /></div>
                </div>
                <div className="emp-form-group">
                  <div className="emp-checkbox-group">
                    <label className="emp-checkbox-label"><input type="checkbox" name="include_pf" checked={formData.include_pf} onChange={handleChange} /> Include PF</label>
                    <label className="emp-checkbox-label"><input type="checkbox" name="include_esi" checked={formData.include_esi} onChange={handleChange} /> Include ESI</label>
                    <label className="emp-checkbox-label"><input type="checkbox" name="include_lwf" checked={formData.include_lwf} onChange={handleChange} /> Include LWF</label>
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">PF Number</label>
                  <div className="emp-form-input-wrap" style={{ maxWidth: '400px' }}>
                    <input type="text" className="emp-input" name="pf_number" value={formData.pf_number} onChange={handleChange} placeholder="e.g. HR/FBD/0003256/000/0000125" />
                  </div>
                </div>
                <div className="emp-form-group">
                  <label className="emp-form-label">UAN Number</label>
                  <div className="emp-form-input-wrap"><input type="text" className="emp-input" name="uan_number" value={formData.uan_number} onChange={handleChange} placeholder="UAN Number" style={{ maxWidth: '400px' }} /></div>
                </div>
                <div className="emp-form-group" style={{ marginTop: '16px' }}>
                  <label className="emp-form-label">PF Excess Contribution</label>
                  <div className="emp-form-input-wrap emp-radio-group-vertical">
                    <label className="emp-radio-label"><input type="radio" name="pf_excess_contribution" value="employee_and_employer" checked={formData.pf_excess_contribution === 'employee_and_employer'} onChange={handleChange} /> Employee & Employer contribution</label>
                    <label className="emp-radio-label"><input type="radio" name="pf_excess_contribution" value="employee_only" checked={formData.pf_excess_contribution === 'employee_only'} onChange={handleChange} /> Employee contribution only</label>
                  </div>
                </div>
              </div>
            </form>
          )}

          {currentStep === 6 && (
            <form className="emp-add-grid" style={{ gridTemplateColumns: '1fr' }}>
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

          <div className="emp-form-actions">
            {currentStep > 1 && (
              <button type="button" className="emp-btn emp-btn-secondary" onClick={handleBack} style={{ marginRight: 'auto' }} disabled={isSubmitting}>Back</button>
            )}
            <button type="button" className="emp-btn emp-btn-secondary" onClick={() => setCurrentStep(1)} disabled={isSubmitting}>Cancel</button>
            <button type="button" className="emp-btn emp-btn-primary" onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : (currentStep < 6 ? "Next" : "Submit")}
            </button>
          </div>

        </div>

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
              <h3 className="emp-notification-title">{notification.type === 'success' ? 'Success!' : 'Error!'}</h3>
              <p className="emp-notification-message">{notification.message}</p>
              <button className="emp-btn emp-btn-primary emp-notification-btn" onClick={() => setNotification({ show: false, type: '', message: '' })}>OK</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
