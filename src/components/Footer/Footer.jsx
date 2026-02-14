import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ variant = 'public' }) {
  const isDark = variant === 'app';

  return (
    <footer className={`site-footer ${isDark ? 'site-footer-dark' : ''}`}>
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to={isDark ? '/dashboard' : '/'} className="footer-logo">
            <img src="/Teluguinfo logo.png" alt="Telugu Info" className="footer-logo-img" />
            <span className="footer-brand-name">Telugu Info</span>
          </Link>
          <p className="footer-tagline">Career Success Platform</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          {!isDark && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">&copy; {new Date().getFullYear()} Telugu Info. All rights reserved.</p>
          <p className="footer-contact">
            Questions? <Link to="/contact">Contact us</Link> · <Link to="/about">About</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
