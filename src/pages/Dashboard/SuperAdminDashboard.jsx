import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getActivityStats } from '../../api/activities';
import { getPendingDocuments } from '../../api/documents';
import { getSuperAdminTickets } from '../../api/tickets';
import { handleApiError } from '../../utils/errorHandler';
import { FiClock, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import './Dashboard.css';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, pendingRes, ticketsRes] = await Promise.all([
          getActivityStats(),
          getPendingDocuments(),
          getSuperAdminTickets(),
        ]);
        setStats(statsRes?.stats ?? null);
        setPendingCount(pendingRes?.data?.length ?? pendingRes?.count ?? 0);
        setCompletedCount(ticketsRes?.data?.length ?? ticketsRes?.count ?? 0);
      } catch (err) {
        toast.error(handleApiError(err));
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Overview & quick actions</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">{stats?.totalActivities ?? '–'}</span>
          <span className="stat-label">Total Activities</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{pendingCount}</span>
          <span className="stat-label">Pending Documents</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed Tickets</span>
        </div>
      </div>

      <h2 className="dashboard-section-title">Everything You Need for Success</h2>
      <p className="dashboard-subtitle">
        Quick access to documents, tickets, and activity insights.
      </p>

      <div className="dashboard-cards">
        <Link to="/documents/pending" className="dashboard-card">
          <FiClock size={32} />
          <h3>Pending Documents</h3>
          <p>Review and approve documents</p>
        </Link>
        <Link to="/tickets/completed" className="dashboard-card">
          <FiCheckCircle size={32} />
          <h3>Completed Tickets</h3>
          <p>View resolved support tickets</p>
        </Link>
        <Link to="/activities" className="dashboard-card">
          <FiBarChart2 size={32} />
          <h3>Activity Dashboard</h3>
          <p>Activity log & filters</p>
        </Link>
        <Link to="/activities/stats" className="dashboard-card">
          <FiBarChart2 size={32} />
          <h3>Activity Statistics</h3>
          <p>Charts by role, action, resource</p>
        </Link>
        <Link to="/admin/companies" className="dashboard-card">
          <FiBarChart2 size={32} />
          <h3>Company Verification</h3>
          <p>Approve or reject recruiter/company accounts</p>
        </Link>
      </div>
    </div>
  );
}
