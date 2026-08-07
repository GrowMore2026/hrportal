import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [companyLogo, setCompanyLogo] = React.useState("/Logos/lightning.svg"); // This will be set dynamically based on the tenant/company

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add Supabase Auth Logic here later
    // For now, let's just route to a dummy dashboard
    console.log("Login clicked");
  };

  return (
    <div className="login-container">
      <div className="main-login-card">
        
        {/* Left Column: Login Form */}
        <div className="login-left">
          <div className="login-content">
            <div className="brand-logo-container">
              {companyLogo ? (
                <img src={companyLogo} alt="Company Logo" className="company-logo-img" />
              ) : (
                <div className="brand-logo">Acme <span>Corp</span></div>
              )}
              <img src="/Logos/logo.png" alt="PraveaX Logo" className="brand-logo-img" />
            </div>
            
            <h2 className="greeting">Hello there! 👋</h2>
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Login ID</label>
                <input type="text" placeholder="admin@praveax.com" required />
              </div>
              
              <div className="input-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input type="password" placeholder="••••••••" required />
                  <button type="button" className="eye-btn" aria-label="Toggle password visibility">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </div>
              
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn">Login</button>
            </form>
          </div>
        </div>

        {/* Right Column: Promotional Banner */}
        <div className="login-right">
          <div className="promo-content">
            <h1>Manage your workforce effortlessly</h1>
            <p>The all-in-one HR platform built for modern teams.</p>
            
            <div className="mockup-card">
              <div className="mockup-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-line w-80"></div>
              <div className="mockup-line w-60"></div>
              <div className="mockup-line w-90"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
