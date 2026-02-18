import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiFileText,
  FiAward,
  FiMap,
  FiTarget,
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
  FiBriefcase,
  FiBell,
} from 'react-icons/fi';
import './Layout.css';

const navByRole = {
  USER: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/feed', label: 'Feed', icon: FiBriefcase },
    // { to: '/posts', label: 'Posts', icon: FiBriefcase },
    // { to: '/company-posts', label: 'Company Posts', icon: FiBriefcase },
    { to: '/student/jobs', label: 'Job Listings', icon: FiBriefcase },
    { to: '/documents', label: 'Hall Tickets & Results', icon: FiFileText },
    { to: '/tickets', label: 'Tickets', icon: FiMessageSquare },
    { to: '/ai-career', label: 'AI Career & Roadmaps', icon: FiTarget },
    { to: '/predictor', label: 'College Predictor', icon: FiTrendingUp },
    { to: '/me', label: 'Profile', icon: FiUser },
  ],
  COMPANY: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/feed', label: 'Feed', icon: FiBriefcase },
    { to: '/company/posts', label: 'Company Posts', icon: FiBriefcase },
    { to: '/company/profile', label: 'Company Profile', icon: FiUser },
  ],
  SUPPORT: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/documents/upload', label: 'Upload Document', icon: FiUploadCloud },
    { to: '/documents/my-uploads', label: 'My Uploads', icon: FiGrid },
    { to: '/tickets/support', label: 'Tickets', icon: FiMessageSquare },
    { to: '/chats/support-admin', label: 'Support ↔ Admin Chat', icon: FiMessageSquare },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/jobs', label: 'Job Postings', icon: FiBriefcase },
    { to: '/documents/upload', label: 'Upload Document', icon: FiUploadCloud },
    { to: '/documents/my-uploads', label: 'My Uploads', icon: FiGrid },
    { to: '/chats/support-admin', label: 'Support ↔ Admin Chat', icon: FiMessageSquare },
    { to: '/chats/admin-super-admin', label: 'Admin Chat', icon: FiMessageSquare },
    { to: '/profile', label: 'Profile', icon: FiUser },
  ],
  SUPER_ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    { to: '/admin/jobs', label: 'Job Postings', icon: FiBriefcase },
    { to: '/documents/pending', label: 'Pending Documents', icon: FiClock },
    { to: '/documents/approve', label: 'Approve Documents', icon: FiCheckCircle },
    { to: '/tickets/completed', label: 'Completed Tickets', icon: FiMessageSquare },
    { to: '/activities', label: 'Activity Dashboard', icon: FiBarChart2 },
    { to: '/activities/stats', label: 'Activity Statistics', icon: FiTrendingUp },
    { to: '/chats/support-admin', label: 'Support ↔ Admin Chat', icon: FiMessageSquare },
    { to: '/chats/admin-super-admin', label: 'Admin Chat', icon: FiMessageSquare },
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
            const isActive = location.pathname === to;
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
