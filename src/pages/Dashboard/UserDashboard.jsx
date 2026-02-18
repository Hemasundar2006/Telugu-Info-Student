import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiFileText, FiMessageSquare, FiTrendingUp, FiBell, FiBriefcase } from 'react-icons/fi';
import './Dashboard.css';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      <p className="dashboard-subtitle">Student Dashboard</p>

      <div className="dashboard-cards">
        {/* <Link to="/student/notifications" className="dashboard-card">
          <FiBell size={32} />
          <h3>Job Notifications</h3>
          <p>New jobs matching your qualification</p>
        </Link> */}
        <Link to="/student/jobs" className="dashboard-card">
          <FiBriefcase size={32} />
          <h3>Job Listings</h3>
          <p>Browse and apply to jobs</p>
        </Link>
        <Link to="/documents" className="dashboard-card">
          <FiFileText size={32} />
          <h3>Documents</h3>
          <p>View hall tickets, results & roadmaps</p>
        </Link>
        <Link to="/tickets/new" className="dashboard-card">
          <FiMessageSquare size={32} />
          <h3>Create Ticket</h3>
          <p>Need help? Create a support ticket</p>
        </Link>
        <Link to="/tickets" className="dashboard-card">
          <FiMessageSquare size={32} />
          <h3>My Tickets</h3>
          <p>Track your support requests</p>
        </Link>
        <Link to="/predictor" className="dashboard-card">
          <FiTrendingUp size={32} />
          <h3>College Predictor</h3>
          <p>Find colleges by rank & category</p>
        </Link>
      </div>
    </div>
  );
}
