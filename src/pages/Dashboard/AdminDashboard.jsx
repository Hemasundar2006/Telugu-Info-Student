import { Link } from 'react-router-dom';
import { FiUploadCloud, FiGrid } from 'react-icons/fi';
import './Dashboard.css';

export default function AdminDashboard() {
  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Upload documents (Super Admin approval required)</p>

      <div className="dashboard-cards">
        <Link to="/documents/upload" className="dashboard-card">
          <FiUploadCloud size={32} />
          <h3>Upload Document</h3>
          <p>Upload documents for approval</p>
        </Link>
        <Link to="/documents/my-uploads" className="dashboard-card">
          <FiGrid size={32} />
          <h3>My Uploads</h3>
          <p>View your uploaded documents</p>
        </Link>
      </div>
    </div>
  );
}
