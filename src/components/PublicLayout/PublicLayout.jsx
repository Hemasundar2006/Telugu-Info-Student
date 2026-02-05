import { Link, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="public-layout">
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/Teluguinfo logo.png" alt="Telugu Info" className="logo-img" />
          <div className="logo-text">
            <span className="logo-title">Telugu Info</span>
            <span className="logo-subtitle">Career Success Platform</span>
          </div>
        </Link>
        <nav className="landing-nav">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/pricing" className={`nav-link ${pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
          <Link to="/services" className={`nav-link ${pathname === '/services' ? 'active' : ''}`}>Services</Link>
          <Link to="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </nav>
        <div className="landing-header-right">
          <Link to="/login" className="nav-link header-login">Login</Link>
          <Link to="/register" className="nav-link nav-register">Register</Link>
        </div>
      </header>
      <main className="public-main">
        {children}
      </main>
      <Footer variant="public" />
    </div>
  );
}
