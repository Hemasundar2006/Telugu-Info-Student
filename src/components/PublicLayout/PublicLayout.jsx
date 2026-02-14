import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './PublicLayout.css';

export default function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <div className="public-layout">
      <header className="landing-header animate-header-in">
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
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
        >
          <span />
          <span />
          <span />
        </button>
        {/* Desktop: inline nav. Mobile: vertical dropdown with left-to-right item animation */}
        <nav
          className={`landing-nav ${navOpen ? 'landing-nav-open' : ''}`}
          aria-label="Main navigation"
        >
          <div className="mobile-nav-drawer-header">
            <span className="mobile-nav-drawer-title">Menu</span>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
          <div className="mobile-nav-drawer-links">
            <Link to="/" className={`nav-link nav-link-drawer ${isActive('/') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Home</Link>
            <Link to="/about" className={`nav-link nav-link-drawer ${isActive('/about') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>About</Link>
            <Link to="/tech-news" className={`nav-link nav-link-drawer ${isActive('/tech-news') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Tech News</Link>
            <Link to="/ai-career" className={`nav-link nav-link-premium nav-link-drawer ${isActive('/ai-career') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>
              AI Career <span className="nav-premium-badge" title="Premium">★</span>
            </Link>
            <Link to="/pricing" className={`nav-link nav-link-drawer ${isActive('/pricing') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Pricing</Link>
            <Link to="/services" className={`nav-link nav-link-drawer ${isActive('/services') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Services</Link>
            <Link to="/contact" className={`nav-link nav-link-drawer ${isActive('/contact') ? 'active' : ''}`} onClick={() => setNavOpen(false)}>Contact</Link>
            <div className="mobile-nav-drawer-ctas">
              <Link to="/login" className="nav-link nav-link-drawer nav-link-drawer-login" onClick={() => setNavOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link nav-link-drawer nav-link-drawer-register" onClick={() => setNavOpen(false)}>Register</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="public-main">
        {children}
      </main>
      <Footer variant="public" />
    </div>
  );
}
