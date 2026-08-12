import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AddEmployee.css';

// SVG for Edit Icon
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '12px', color: '#6b7280', cursor: 'pointer' }}>
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

export default function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="emp-add-page-layout">
      {/* ── Main Content ── */}
      <main className="emp-add-main-content">
        
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
                    <input type="text" className="emp-input" placeholder="e.g. GM001" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="Full Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Birth</label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Aadhaar Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="12-digit Aadhaar" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Gender</label>
                  <div className="emp-form-input-wrap emp-radio-group">
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" /> Male
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" /> Female
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="gender" /> Others
                    </label>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Reporting Manager</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select">
                      <option value="">Select Manager</option>
                      <option value="manager1">Juhi Thakwani [GM008]</option>
                    </select>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Status</label>
                  <div className="emp-form-input-wrap">
                    <select className="emp-select">
                      <option value="">Select Status</option>
                      <option value="probation">Probation</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Date Of Joining <span className="emp-required">*</span></label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="emp-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="emp-form-group">
                  <label className="emp-form-label">Probation Period</label>
                  <div className="emp-form-input-wrap emp-inline-input">
                    <input type="number" className="emp-input" placeholder="0" />
                    <span className="emp-inline-text">Days</span>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Confirmation Date</label>
                  <div className="emp-form-input-wrap">
                    <input type="date" className="emp-input" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Email</label>
                  <div className="emp-form-input-wrap">
                    <input type="email" className="emp-input" placeholder="work@company.com" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Mobile Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="tel" className="emp-input" placeholder="+91" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Emergency Contact Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="Contact Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Emergency Contact Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="tel" className="emp-input" placeholder="Contact Number" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Father's name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="Father's Name" />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Spouse Name</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="Spouse Name" />
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
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Division</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Cost Center</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Cost Center</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Grade</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Grade</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Designation</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Designation</option>
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
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Location</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Department</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Department</option>
                    </select>
                    <EditIcon />
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">Shifts</label>
                  <div className="emp-form-input-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <select className="emp-select" style={{ flex: 1 }}>
                      <option value="">Select Shifts</option>
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
                    <input type="text" className="emp-input" placeholder="PAN Number" style={{ maxWidth: '400px' }} />
                  </div>
                </div>

                <div className="emp-form-group">
                  <div className="emp-checkbox-group">
                    <label className="emp-checkbox-label">
                      <input type="checkbox" defaultChecked /> Include PF
                    </label>
                    <label className="emp-checkbox-label">
                      <input type="checkbox" /> Include ESI
                    </label>
                    <label className="emp-checkbox-label">
                      <input type="checkbox" /> Include LWF
                    </label>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">PF Number</label>
                  <div className="emp-form-input-wrap" style={{ maxWidth: '400px' }}>
                    <input type="text" className="emp-input" placeholder="e.g. HR/FBD/0003256/000/0000125" />
                    <span className="emp-form-hint" style={{ color: '#9ca3af', fontWeight: 'normal', fontSize: '12px', marginTop: '8px', cursor: 'default' }}>
                      Format : (Region Code/Office Code/Est Code/Extn No/Member Acc No) Example HR/FBD/0003256/000/0000125.
                    </span>
                  </div>
                </div>

                <div className="emp-form-group">
                  <label className="emp-form-label">UAN Number</label>
                  <div className="emp-form-input-wrap">
                    <input type="text" className="emp-input" placeholder="UAN Number" style={{ maxWidth: '400px' }} />
                  </div>
                </div>

                <div className="emp-form-group" style={{ marginTop: '16px' }}>
                  <label className="emp-form-label">PF Excess Contribution</label>
                  <div className="emp-form-input-wrap emp-radio-group-vertical">
                    <label className="emp-radio-label">
                      <input type="radio" name="pf_excess" defaultChecked /> Employee & Employer contribution - 12% with in wage ceiling (Max Rs.1800)
                    </label>
                    <label className="emp-radio-label">
                      <input type="radio" name="pf_excess" /> Employee contribution - 12% over and above wage ceiling (In excess to Rs.1800)
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
                    <select className="emp-select" style={{ maxWidth: '400px' }}>
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
              <button type="button" className="emp-btn emp-btn-secondary" onClick={handleBack} style={{ marginRight: 'auto' }}>Back</button>
            )}
            <button type="button" className="emp-btn emp-btn-secondary">Cancel</button>
            <button type="button" className="emp-btn emp-btn-primary" onClick={handleNext}>
              {currentStep < 4 ? "Next" : "Submit"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
