import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import './Dashboard.css';

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

const heroImages = {
  morning: '/images/morning.png',
  afternoon: '/images/afternoon.png',
  evening: '/images/evening.png',
};

const greetings = {
  morning: 'Good Morning ☀️',
  afternoon: 'Good Afternoon 🌤️',
  evening: 'Good Evening 🌙',
};

const allItems = [
  { icon: 'user', label: 'Add Employee', category: 'Employee', starred: true },
  { icon: 'user', label: 'Prepare Letter', category: 'Employee', starred: false },
  { icon: 'user', label: 'Import Data From Excel', category: 'Employee', starred: false },
  { icon: 'user', label: 'Employee Separation', category: 'Employee', starred: false },
  { icon: 'user', label: 'Confirm Employee', category: 'Employee', starred: false },
  { icon: 'user', label: 'Delete Employee', category: 'Employee', starred: false },
  { icon: 'user', label: 'Upload Employee Document', category: 'Employee', starred: false },
  { icon: 'user', label: 'Mass Employee Update', category: 'Employee', starred: false },
  { icon: 'db', label: 'Stop Salary Processing', category: 'Payroll', starred: false },
  { icon: 'db', label: 'Process Payroll', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Update Payroll Data', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Salary statement for a month', category: 'Payroll', starred: true },
  { icon: 'db', label: 'Bank Transfer', category: 'Payroll', starred: false },
  { icon: 'calendar', label: 'Add Holidays', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Post Leave Transaction', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Grant Leave', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Approve leave', category: 'Leave', starred: false },
  { icon: 'calendar', label: 'Leave Calendar', category: 'Leave', starred: false },
  { icon: 'folder', label: 'Upload Documents In Bulk', category: 'Other', starred: false },
  { icon: 'folder', label: 'List of Values', category: 'Other', starred: false },
  { icon: 'folder', label: 'Employee Position', category: 'Other', starred: false },
  { icon: 'folder', label: 'Update Company Details', category: 'Other', starred: false },
];

const categories = ['All', 'My Favourites', 'Employee', 'Payroll', 'Leave', 'Other'];

export function Icon({ name }) {
  if (name === 'user') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
  if (name === 'calendar') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
  if (name === 'folder') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  );
}

export function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#f5a623' : 'none'} stroke="#f5a623" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function AddFavouriteModal({ onClose, favouriteLabels, onToggle }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('My Favourites');

  const filtered = allItems.filter((item) => {
    const matchesSearch = item.label.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'My Favourites' ? favouriteLabels.includes(item.label) : item.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="gm-modal-backdrop" onClick={onClose}>
      <div className="gm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gm-modal-header">
          <h2>Search</h2>
          <button className="gm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="gm-modal-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Search here" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>
        <div className="gm-modal-tabs">
          {categories.map((cat) => (
            <button key={cat} className={`gm-modal-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>
        <div className="gm-modal-grid">
          {filtered.map((item) => {
            const isFav = favouriteLabels.includes(item.label);
            return (
              <button key={item.label} className={`gm-modal-card ${isFav ? 'gm-modal-card-fav' : ''}`} onClick={() => onToggle(item)}>
                <div className="gm-modal-card-top">
                  <span className="gm-modal-card-icon"><Icon name={item.icon} /></span>
                  <span className="gm-modal-star"><StarIcon filled={isFav} /></span>
                </div>
                <span className="gm-modal-card-label">{item.label}</span>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="gm-modal-empty">No items found.</p>}
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ onClose, companyLogo, setCompanyLogo }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCompanyLogo(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="gm-modal-backdrop" onClick={onClose}>
      <div className="gm-modal" style={{ width: 400, height: 'auto', padding: 32, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, marginBottom: 24, fontSize: 20 }}>Settings</h2>
        
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, color: '#6b7280', marginBottom: 12, textAlign: 'left' }}>White-Labeling</h3>
          {companyLogo ? (
             <img src={companyLogo} alt="Preview" style={{ height: 48, marginBottom: 16, objectFit: 'contain' }} />
          ) : (
             <div style={{ height: 48, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 8 }}>
               <span style={{ color: '#9ca3af', fontSize: 13 }}>No Custom Logo</span>
             </div>
          )}
          <label style={{ display: 'block', padding: '10px 16px', background: '#1c9c6e', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Upload Company Logo
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />
          </label>
        </div>
        
        {companyLogo && (
          <button 
            style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
            onClick={() => setCompanyLogo(null)}
          >
            Remove Logo
          </button>
        )}
      </div>
    </div>
  );
}

function SearchPalette({ onClose }) {
  return (
    <div className="gm-modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="gm-search-palette" onClick={(e) => e.stopPropagation()}>
        <div className="gm-search-palette-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Search any command or help..." autoFocus />
        </div>
        <div className="gm-search-palette-body">
          <div className="gm-search-palette-shortcuts">
            <div className="gm-search-palette-label">Shortcuts <span className="gm-help-icon">?</span></div>
            <div className="gm-search-palette-pills">
              <button>Pending leaves</button>
              <button>Pre processing checklist</button>
              <button>Post processing checklist</button>
              <button>Employee Info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="gm-modal-backdrop" onClick={onClose}>
      <div className="gm-modal" style={{ width: 400, height: 'auto', padding: '40px 32px', textAlign: 'center', borderRadius: 24 }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, marginBottom: 24, fontSize: 22, color: '#1f2937', fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>Confirm Logout</h2>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 32, fontFamily: "'Poppins', sans-serif" }}>Are you sure you want to log out?</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button 
            style={{ flex: 1, padding: '12px 0', border: '1px solid #d1d5db', background: '#fff', borderRadius: 8, color: '#374151', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            style={{ flex: 1, padding: '12px 0', border: 'none', background: '#ef4444', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ userName = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyLogo, setCompanyLogo] = useState('/Logos/logo.png');
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const appsMenuRef = useRef(null);
  
  // Favourites state lifted here so child components can use it via Outlet context
  const [favourites, setFavourites] = useState([
    { icon: 'user', label: 'Add Employee' },
    { icon: 'db', label: 'Update Payroll Data' },
    { icon: 'db', label: 'Process Payroll' },
    { icon: 'db', label: 'Salary Statement' },
  ]);

  const timeOfDay = getTimeOfDay();
  const greeting = greetings[timeOfDay];
  const heroImage = heroImages[timeOfDay];
  const favouriteLabels = favourites.map((f) => f.label);

  const handleToggleFavourite = (item) => {
    setFavourites((prev) => {
      const exists = prev.find((f) => f.label === item.label);
      if (exists) return prev.filter((f) => f.label !== item.label);
      return [...prev, { icon: item.icon, label: item.label }];
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    const handleClickOutside = (e) => {
      if (appsMenuRef.current && !appsMenuRef.current.contains(e.target)) {
        setShowAppsMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="gm-dash-screen">
      {showModal && (
        <AddFavouriteModal
          onClose={() => setShowModal(false)}
          favouriteLabels={favouriteLabels}
          onToggle={handleToggleFavourite}
        />
      )}
      {showSearchModal && <SearchPalette onClose={() => setShowSearchModal(false)} />}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          companyLogo={companyLogo}
          setCompanyLogo={setCompanyLogo}
        />
      )}

      {/* Top Nav */}
      <header className="gm-dash-nav">

        {/* App switcher grid dots */}
        <div className="gm-apps-menu-container" ref={appsMenuRef} style={{ position: 'relative' }}>
          <button 
            className={`gm-nav-apps-btn ${showAppsMenu ? 'active' : ''}`} 
            aria-label="Apps"
            onClick={() => setShowAppsMenu(!showAppsMenu)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/>
              <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="14" cy="8" r="1.5"/>
              <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/><circle cx="14" cy="14" r="1.5"/>
            </svg>
          </button>

          {showAppsMenu && (
            <div className="gm-apps-dropdown">
              <div className="gm-apps-columns-container">
                {/* Column 1: Home */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Home
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/home'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    <div className="gm-app-name">Welcome</div>
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/home/dashboard'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    <div className="gm-app-name">Dashboard</div>
                  </div>
                </div>

                {/* Column 2: Employee */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading" style={{ cursor: 'pointer' }} onClick={() => { navigate('/employee'); setShowAppsMenu(false); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Employee
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/main/analytics-hub'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                    <div className="gm-app-name">Main</div>
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/employee/employee-profile'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div className="gm-app-name">Information</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <div className="gm-app-name">Admin</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <div className="gm-app-name">Setup</div>
                  </div>
                </div>

                {/* Column 3: Payroll */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                    Payroll
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/payroll'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <div className="gm-app-name">Information</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="gm-app-name">Payroll Inputs</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <div className="gm-app-name">Process</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <div className="gm-app-name">Verify</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    <div className="gm-app-name">Payout</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <div className="gm-app-name">Published Info</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <div className="gm-app-name">Admin</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <div className="gm-app-name">Setup</div>
                  </div>
                </div>

                {/* Column 4: Workforce Management */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Workforce Management
                  </div>
                  <div className="gm-app-item" onClick={() => { navigate('/workforce-management'); setShowAppsMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="gm-app-name">Leave</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div className="gm-app-name">Attendance</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <div className="gm-app-name">Admin Tools</div>
                  </div>
                </div>

                {/* Column 5: Workflow */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    Workflow
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    <div className="gm-app-name">Modules</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <div className="gm-app-name">Setup</div>
                  </div>
                </div>

                {/* Column 6: Reports */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    Reports
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    <div className="gm-app-name">Reports</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    <div className="gm-app-name">Query Builder</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                    <div className="gm-app-name">Advanced Analytics Hub</div>
                  </div>
                </div>

                {/* Column 7: Other */}
                <div className="gm-apps-column">
                  <div className="gm-apps-col-heading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c9c6e" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    Other
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    <div className="gm-app-name">Task</div>
                  </div>
                  <div className="gm-app-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <div className="gm-app-name">Engage</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="gm-brand-logo-img" />
          ) : (
            <div className="gm-brand-mark">
              <div className="gm-brand-text-stack"><span>GROW</span><span>MORE</span></div>
            </div>
          )}
        </Link>

        {/* Search bar */}
        <div className="gm-nav-search" onClick={() => setShowSearchModal(true)} style={{ cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <span>Search Anything</span>
          <kbd>Ctrl + K</kbd>
        </div>

        {/* Right side actions */}
        <div className="gm-nav-actions">

          {/* Settings gear + chevron */}
          <button className="gm-nav-settings-btn" aria-label="Settings" onClick={() => setShowSettingsModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6c.6.3 1.4.2 1.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9c.3.6.9 1 1.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" />
            </svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Divider */}
          <div className="gm-nav-divider" />

          {/* Power / logout */}
          <button className="gm-icon-btn" aria-label="Logout" onClick={() => setShowLogoutModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

        </div>
      </header>

      <main className="gm-bento" style={!location.pathname.startsWith('/home') ? { padding: 0, background: '#fff', display: 'block' } : {}}>
        {/* Hero Banner (Only shown on /home routes) */}
        {location.pathname.startsWith('/home') && (
          <section className="gm-widget gm-widget-hero" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="gm-hero-overlay">
              <div className="gm-hero-greeting-box">
                <div className="gm-dash-tabs">
                  <button 
                    className={`gm-tab ${!isDashboard ? 'active' : ''}`} 
                    onClick={() => navigate('/home')}
                  >
                    Welcome
                  </button>
                  <button 
                    className={`gm-tab ${isDashboard ? 'active' : ''}`} 
                    onClick={() => navigate('/home/dashboard')}
                  >
                    Dashboard
                  </button>
                </div>
                <h1>{greeting}{userName ? `, ${userName}.` : '.'}</h1>
                <p>Let's do great things today.</p>
              </div>
              <div className="gm-hero-stats">
                <div className="gm-hero-stat-block">
                  <span className="gm-hero-stat-num">0</span>
                  <span className="gm-hero-stat-label">Things to review</span>
                </div>
                <div className="gm-hero-stat-divider" />
                <div className="gm-hero-stat-block">
                  <span className="gm-hero-stat-num">3</span>
                  <span className="gm-hero-stat-label">Things to monitor</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Outlet for Welcome / Dashboard Content */}
        <Outlet context={{ favourites, setShowModal }} />
      </main>

      {/* Modals */}
      {showModal && <AddFavouriteModal onClose={() => setShowModal(false)} favouriteLabels={favouriteLabels} onToggle={handleToggleFavourite} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} companyLogo={companyLogo} setCompanyLogo={setCompanyLogo} />}
      {showSearchModal && <SearchPalette onClose={() => setShowSearchModal(false)} />}
      {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} onConfirm={() => navigate('/')} />}
    </div>
  );
}
