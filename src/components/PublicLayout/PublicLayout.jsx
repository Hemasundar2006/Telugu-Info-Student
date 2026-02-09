import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const isActive = (path) => pathname === path;

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
        <button
          type="button"
          className={`landing-menu-btn ${navOpen ? 'open' : ''}`}
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`landing-nav ${navOpen ? 'landing-nav-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>About</Link>
          <Link to="/tech-news" className={`nav-link ${isActive('/tech-news') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Tech News</Link>
          <Link to="/ai-career" className={`nav-link nav-link-premium ${isActive('/ai-career') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>
            AI Career <span className="nav-premium-badge" title="Premium">★</span>
          </Link>
          <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Pricing</Link>
          <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Services</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Contact</Link>
          <Link to="/login" className="nav-link header-login" onClick={() => setNavOpen(false)}>Login</Link>
          <Link to="/register" className="nav-link nav-register" onClick={() => setNavOpen(false)}>Register</Link>
        </nav>
      </header>
      <main className="public-main">
        {children}
      </main>
      <Footer variant="public" />
    </div>
  );
}
