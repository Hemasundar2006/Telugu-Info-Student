import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const load = async () => {
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
      }
    };

    load();
  }, [user]);

  const status = company?.verificationStatus || 'PENDING';
  const isVerified = status === 'VERIFIED';

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
            {status === 'VERIFIED'
              ? 'Verified'
              : status === 'REJECTED'
              ? 'Rejected'
              : 'Pending'}
          </span>
          <span className="stat-label">Verification Status</span>
        </div>
      </div>

      {!loading && !isVerified && (
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

