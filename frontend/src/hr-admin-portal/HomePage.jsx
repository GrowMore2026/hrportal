import React, { useState, useEffect } from 'react';
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

export default function HomePage({ userName = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyLogo, setCompanyLogo] = useState('/Logos/logo.png');
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        <Link to="/home" style={{ textDecoration: 'none' }}>
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="gm-brand-logo-img" />
          ) : (
            <div className="gm-brand-mark">
              <div className="gm-brand-text-stack"><span>GROW</span><span>MORE</span></div>
            </div>
          )}
        </Link>

        <div className="gm-nav-search" onClick={() => setShowSearchModal(true)} style={{ cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <span>Search anything</span>
          <kbd>CTRL K</kbd>
        </div>

        <div className="gm-nav-actions">
          <button className="gm-icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
          </button>
          <button className="gm-icon-btn" aria-label="Settings" onClick={() => setShowSettingsModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6c.6.3 1.4.2 1.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9c.3.6.9 1 1.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" />
            </svg>
          </button>
          <div className="gm-avatar">A</div>
        </div>
      </header>

      <main className="gm-bento">
        {/* Hero Banner */}
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

        {/* Outlet for Welcome / Dashboard Content */}
        <Outlet context={{ favourites, setShowModal }} />
      </main>
    </div>
  );
}
