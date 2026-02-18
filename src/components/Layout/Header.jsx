import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiLogOut, FiUser, FiSearch, FiBell, FiPlus } from 'react-icons/fi';
import { getNotifications } from '../../api/studentNotifications';
import './Layout.css';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const navClass = (path, exact) =>
    `app-nav-link${exact ? pathname === path : pathname.startsWith(path) ? ' active' : ''}`;

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';
  const avatarImage = user?.profileImage || user?.profilePhoto;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const role = user?.role || 'USER';
  const isCompany = role === 'COMPANY';
  const profilePath = isCompany ? '/company/profile' : '/profile';
  const profileLabel = isCompany ? 'Company Profile' : 'Student Profile';
  const showNotifications = role === 'USER';
  const hasPaidPlan =
    user?.plan?.isPaid === true ||
    user?.hasPaidPlan === true ||
    user?.isPaid === true;

  useEffect(() => {
    if (showNotifications && user) {
      const loadNotifications = async () => {
        try {
          const res = await getNotifications({ isRead: false });
          if (res?.success) {
            setNotificationCount(res.unreadCount ?? 0);
          }
        } catch (err) {
          // Silently fail - notifications are optional
          console.error('Failed to load notifications:', err);
        }
      };
      loadNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [showNotifications, user]);

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
      <form
        className="header-search-wrap"
        onSubmit={(e) => {
          e.preventDefault();
          const q = searchTerm.trim();
          if (!q) return;
          navigate(`/search?query=${encodeURIComponent(q)}`);
        }}
      >
        <FiSearch size={18} className="search-icon" aria-hidden />
        <input
          type="search"
          placeholder="Search people..."
          aria-label="Search people"
          className="header-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <nav className="app-nav">
        <Link to="/dashboard" className={navClass('/dashboard', true)}>
          Home
        </Link>
        <Link to="/documents" className={navClass('/documents', false)}>
          Documents
        </Link>
        <Link to="/tech-news" className={navClass('/tech-news', true)}>
          Tech News
        </Link>
        <Link to="/ai-career" className={navClass('/ai-career', true)}>
          AI Career
        </Link>
        <Link to="/predictor" className={navClass('/predictor', true)}>
          Predictor
        </Link>
      </nav>
      <div className="header-right">
        {role === 'USER' && (
          <button
            type="button"
            className="header-add-post-btn"
            onClick={() => navigate('/posts/new')}
          >
            <FiPlus size={18} />
            <span>New post</span>
          </button>
        )}
        {showNotifications && (
          <Link
            to="/student/notifications"
            className="header-notification-btn"
            aria-label={`Job notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
          >
            <FiBell size={20} />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
            )}
          </Link>
        )}
        <div className="user-menu-wrap">
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
          >
            <span className="avatar">
              {avatarImage ? (
                <img src={avatarImage} alt={user?.name || 'Profile'} />
              ) : (
                initials
              )}
            </span>
            <span className="user-name">
              {user?.name}
              {hasPaidPlan && (
                <img
                  src="/verified.png"
                  alt="Verified"
                  className="header-user-verified"
                />
              )}
            </span>
          </button>
          {menuOpen && (
            <>
              <div className="backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="user-dropdown user-dropdown-dark">
                <Link to={profilePath} onClick={() => setMenuOpen(false)}>
                  <FiUser /> {profileLabel}
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
