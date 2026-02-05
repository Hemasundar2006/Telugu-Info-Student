import { Link } from 'react-router-dom';
import './Login.css';

export default function ForgotPassword() {
  return (
    <div className="login-split">
      <div className="login-form-panel">
        <div className="login-form-inner">
          <h1 className="login-welcome">Forgot Password?</h1>
          <p className="login-subtitle">
            Contact support or use your registered email to reset your password.
          </p>
          <Link to="/login" className="login-btn-primary" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>
      <div className="login-brand-panel">
        <div className="brand-content">
          <img src="/Teluguinfo logo.png" alt="తెలుగు InfQ" className="brand-logo-img" />
          <h2 className="brand-title">తెలుగు InfQ</h2>
          <p className="brand-tagline">Career Success Platform</p>
        </div>
      </div>
    </div>
  );
}
