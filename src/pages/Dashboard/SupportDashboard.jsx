import { Link } from 'react-router-dom';
import { FiUploadCloud, FiGrid, FiMessageSquare } from 'react-icons/fi';
import './Dashboard.css';

export default function SupportDashboard() {
  return (
    <div className="dashboard-page">
      <h1>Support Dashboard</h1>
      <p className="dashboard-subtitle">Upload documents & manage tickets</p>

      <div className="dashboard-cards">
        <Link to="/documents/upload" className="dashboard-card">
          <FiUploadCloud size={32} />
          <h3>Upload Document</h3>
          <p>Upload hall tickets, results, roadmaps</p>
        </Link>
        <Link to="/documents/my-uploads" className="dashboard-card">
          <FiGrid size={32} />
          <h3>My Uploads</h3>
          <p>View your uploaded documents</p>
        </Link>
        <Link to="/tickets/support" className="dashboard-card">
          <FiMessageSquare size={32} />
          <h3>Tickets</h3>
          <p>Assign and complete support tickets</p>
        </Link>
      </div>
    </div>
  );
}
