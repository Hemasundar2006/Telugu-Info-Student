import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiLogOut, FiUser, FiSearch } from 'react-icons/fi';
import './Layout.css';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="app-header app-header-dark">
      <button type="button" className="menu-btn" onClick={onMenuClick} aria-label="Menu">
        <FiMenu size={24} />
      </button>
      <Link to="/dashboard" className="logo-block">
        <img src="/Teluguinfo logo.png" alt="Telugu Info" className="logo-img" />
        <div className="logo-text">
          <span className="logo-title">Telugu Info</span>
          <span className="logo-subtitle">Career Success Platform</span>
        </div>
      </Link>
      <nav className="app-nav">
        <Link to="/dashboard" className="app-nav-link">Home</Link>
        <Link to="/documents" className="app-nav-link">Documents</Link>
        <Link to="/predictor" className="app-nav-link">Predictor</Link>
      </nav>
      <div className="header-right">
        <button type="button" className="icon-btn" aria-label="Search">
          <FiSearch size={20} />
        </button>
        <div className="user-menu-wrap">
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
          >
            <span className="avatar">{initials}</span>
            <span className="user-name">{user?.name}</span>
          </button>
          {menuOpen && (
            <>
              <div className="backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="user-dropdown user-dropdown-dark">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <button type="button" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
