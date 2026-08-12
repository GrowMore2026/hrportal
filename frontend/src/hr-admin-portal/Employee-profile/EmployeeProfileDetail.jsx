import React from 'react';
import './EmployeeProfileDetail.css';

const EditIcon = () => (
  <svg className="emp-detail-edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
  </svg>
);

const SectionHeader = ({ title }) => (
  <div className="emp-detail-section-header">
    <h3 className="emp-detail-section-title">{title}</h3>
    <EditIcon />
  </div>
);

const SubSectionHeader = ({ title }) => (
  <div className="emp-detail-subsection-header">
    <EditIcon />
    <span>{title}</span>
  </div>
);

const DetailItem = ({ label, value, link }) => (
  <div className="emp-detail-item">
    <span className="emp-detail-label">{label}</span>
    <span className="emp-detail-value">
      {link ? <a href={link}>{value}</a> : (value || '-')}
    </span>
  </div>
);

export default function EmployeeProfileDetail({ employee }) {
  if (!employee) return null;

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
            <h2 className="emp-detail-name">{employee.name}</h2>
            <p className="emp-detail-id">{employee.id}</p>
          </div>
        </div>
        <button className="emp-detail-request-btn">
          <EditIcon />
          Request Update
        </button>
      </div>

      {/* ── Basic Employee Information ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Basic Employee Information" />
        <div className="emp-detail-grid">
          <DetailItem label="Title" value="Mr." />
          <DetailItem label="First Name" value={employee.name.split(' ')[0]} />
          <DetailItem label="Gender" value="Male" />
          <DetailItem label="Email" value={employee.email} link={`mailto:${employee.email}`} />
          <DetailItem label="Mobile" value="+91 9987654321" />
          <DetailItem label="Profile Image" value="profile_pic.jpg" link="#" />
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Personal Information" />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="DOB" value="12-Oct-1995" />
          <DetailItem label="Blood Group" value="O+" />
          <DetailItem label="Marital Status" value="Single" />
          <DetailItem label="Father's Name" value="Rajesh Bamroliya" />
          <DetailItem label="Spouse's Name" value="-" />
          <DetailItem label="Nationality" value="Indian" />
        </div>
      </div>

      {/* ── Joining Details ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Joining Details" />
        <div className="emp-detail-grid">
          <DetailItem label="Date Of Join" value="01-Jan-2024" />
          <DetailItem label="Confirmation Date" value="01-Jul-2024" />
          <DetailItem label="Status" value={employee.status} />
          <DetailItem label="Probation Period" value="180 Days" />
          <DetailItem label="Notice Period" value="30 Days" />
          <DetailItem label="Current Experience in Year" value="0.5" />
          <DetailItem label="Total Experience" value="2 Years" />
        </div>
      </div>

      {/* ── Current Position ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Current Position" />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="Department" value={employee.department} />
          <DetailItem label="Designation" value={employee.designation} />
          <DetailItem label="Location" value="India" />
          <DetailItem label="Reporting To" value="Manager Name (M001)" />
        </div>
      </div>

      {/* ── Previous Work Experience ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Previous Work Experience" />
        <div className="emp-detail-grid cols-3">
          <DetailItem label="Organization" value="Tech Solutions" />
          <DetailItem label="Designation" value="Junior Developer" />
          <DetailItem label="Location" value="Ahmedabad" />
          <DetailItem label="From" value="2022-06-01" />
          <DetailItem label="To" value="2023-12-31" />
        </div>
      </div>

      {/* ── Address Details ── */}
      <div className="emp-detail-section">
        <SectionHeader title="Address Details" />
        
        <div className="emp-detail-subsection">
          <SubSectionHeader title="Present" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" value={employee.name} />
            <DetailItem label="Address" value="123, Ring Road" />
            <DetailItem label="City" value="Ahmedabad" />
            <DetailItem label="Country" value="India" />
            <DetailItem label="Pincode" value="380001" />
            <DetailItem label="Phone" value="-" />
          </div>
        </div>

        <div className="emp-detail-subsection">
          <SubSectionHeader title="Permanent" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" value={employee.name} />
            <DetailItem label="Address" value="123, Ring Road" />
            <DetailItem label="City" value="Ahmedabad" />
            <DetailItem label="Country" value="India" />
            <DetailItem label="Pincode" value="380001" />
            <DetailItem label="Phone" value="-" />
          </div>
        </div>

        <div className="emp-detail-subsection">
          <SubSectionHeader title="Emergency Contact" />
          <div className="emp-detail-grid cols-3">
            <DetailItem label="Name" value="Rajesh Bamroliya" />
            <DetailItem label="Relationship" value="Father" />
            <DetailItem label="Address" value="123, Ring Road" />
            <DetailItem label="Country" value="India" />
            <DetailItem label="Pincode" value="380001" />
            <DetailItem label="Phone" value="+91 9988776655" />
          </div>
        </div>
      </div>

    </div>
  );
}
