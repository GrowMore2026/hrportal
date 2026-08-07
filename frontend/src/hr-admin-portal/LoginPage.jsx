import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [companyLogo, setCompanyLogo] = React.useState("/Logos/lightning.svg"); // This will be set dynamically based on the tenant/company
  const [showPassword, setShowPassword] = React.useState(false);

  // Dummy auth state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded check for HR Admin
    if (email === 'krushant@growmor.co.in' && password === 'GrowMore@2026') {
      console.log("Login successful! Redirecting...");
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

              <div className="input-group">
                <label>Login ID</label>
                <input
                  type="text"
                  placeholder="admin@praveax.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="eye-btn" onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
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
