import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiFileText,
  FiUploadCloud,
  FiMessageSquare,
  FiPlusCircle,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiTrendingUp,
  FiUser,
  FiGrid,
  FiX,
} from 'react-icons/fi';
import './Layout.css';

const navByRole = {
  USER: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/documents', label: 'Documents', icon: FiFileText },
    { to: '/documents#hall-tickets', label: 'Hall Tickets', icon: FiFileText },
    { to: '/documents#results', label: 'Results', icon: FiFileText },
    { to: '/tickets/new', label: 'Create Ticket', icon: FiPlusCircle },
    { to: '/tickets', label: 'My Tickets', icon: FiMessageSquare },
    { to: '/predictor', label: 'College Predictor', icon: FiTrendingUp },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
  SUPPORT: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/documents/upload', label: 'Upload Document', icon: FiUploadCloud },
    { to: '/documents/my-uploads', label: 'My Uploads', icon: FiGrid },
    { to: '/tickets/support', label: 'Tickets', icon: FiMessageSquare },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/documents/upload', label: 'Upload Document', icon: FiUploadCloud },
    { to: '/documents/my-uploads', label: 'My Uploads', icon: FiGrid },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
  SUPER_ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/documents/pending', label: 'Pending Documents', icon: FiClock },
    { to: '/documents/approve', label: 'Approve Documents', icon: FiCheckCircle },
    { to: '/tickets/completed', label: 'Completed Tickets', icon: FiMessageSquare },
    { to: '/activities', label: 'Activity Dashboard', icon: FiBarChart2 },
    { to: '/activities/stats', label: 'Activity Statistics', icon: FiTrendingUp },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const items = navByRole[user?.role] || navByRole.USER;

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          onMouseEnter={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FiX size={24} />
        </button>
        <nav className="sidebar-nav">
          {items.map(({ to, label, icon: Icon }) => {
            const isActive = to.includes('#')
              ? location.pathname + (location.hash || '') === to
              : location.pathname === to && !location.hash;
            return (
              <Link
                key={to}
                to={to}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
