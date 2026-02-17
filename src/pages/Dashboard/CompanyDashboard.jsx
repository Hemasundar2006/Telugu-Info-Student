import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyCompanyProfile } from '../../api/companies';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCompany = useCallback(async () => {
    if (!user || user.role !== 'COMPANY') {
      setLoading(false);
      return;
    }

    try {
      const res = await getMyCompanyProfile();
      if (res?.success && res.data) {
        setCompany(res.data);
      } else {
        toast.error(res?.error || 'Failed to load company info');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  const normalizedStatus = (company?.verificationStatus || '')
    .toString()
    .trim()
    .toLowerCase();
  const isVerified = company?.isVerified === true || normalizedStatus === 'verified';
  const isRejected = normalizedStatus === 'rejected';
  const status = isVerified ? 'verified' : isRejected ? 'rejected' : 'pending';

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      <p className="dashboard-subtitle">Recruiter / Company Dashboard</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">
            {company?.companyName || 'Pending'}
          </span>
          <span className="stat-label">Company</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {status === 'verified'
              ? 'Verified'
              : status === 'rejected'
              ? 'Rejected'
              : 'Pending'}
          </span>
          <span className="stat-label">Verification Status</span>
        </div>
      </div>

      {user?.role === 'COMPANY' && (
        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => {
              setRefreshing(true);
              loadCompany();
            }}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh status'}
          </button>
        </div>
      )}

      {!loading && !isVerified && !isRejected && (
        <div className="dashboard-alert dashboard-alert-warning">
          <p>
            Your company is currently <strong>pending verification</strong>. A Telugu Info
            Super Admin will review your details soon. You can browse the platform, but company
            profile editing and job posting will unlock after approval.
          </p>
        </div>
      )}

      {isVerified && (
        <div className="dashboard-alert dashboard-alert-success">
          <p>
            Your company is <strong>verified</strong>. You can now complete your company profile
            and start posting jobs for students.
          </p>
        </div>
      )}

      {!loading && isRejected && (
        <div className="dashboard-alert dashboard-alert-error">
          <p>
            Your company was <strong>rejected</strong>. Please contact support or update your
            details and wait for a new review.
          </p>
        </div>
      )}

      <h2 className="dashboard-section-title">Next steps</h2>
      <p className="dashboard-subtitle">
        Once verified, manage your company profile and jobs from here.
      </p>

      <div className="dashboard-cards">
        <Link to="/company/profile" className="dashboard-card">
          <h3>Company Profile</h3>
          <p>View verification status and update public company details.</p>
        </Link>
        <div className="dashboard-card dashboard-card-disabled">
          <h3>Job postings</h3>
          <p>Job posting is managed by Admins. Contact support to post jobs for students.</p>
        </div>
        <div className="dashboard-card dashboard-card-disabled">
          <h3>Applications (coming soon)</h3>
          <p>Review, shortlist, and hire candidates from your job applications.</p>
        </div>
      </div>
    </div>
  );
}

