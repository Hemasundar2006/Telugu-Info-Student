import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyCompanyProfile, getMyCompanyJobs } from '../../api/companies';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(false);

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

  const loadJobs = useCallback(async () => {
    if (!user || user.role !== 'COMPANY') return;
    setJobsLoading(true);
    setJobsError(false);
    try {
      const res = await getMyCompanyJobs({ page: 1, limit: 5 });
      const list = res?.data?.jobs ?? res?.jobs ?? res?.data ?? [];
      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      setJobsError(true);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  useEffect(() => {
    if (company) loadJobs();
  }, [company, loadJobs]);

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
        <Link to="/company/posts" className="dashboard-card">
          <h3>Company Posts</h3>
          <p>Share updates and opportunities. Track likes, comments, and shares.</p>
        </Link>
        <div className="dashboard-card dashboard-card-jobs">
          <h3>Job postings</h3>
          {jobsLoading ? (
            <p className="dashboard-card-muted">Loading your jobs…</p>
          ) : jobsError ? (
            <p className="dashboard-card-muted">
              Unable to load jobs. Contact support to post jobs for students.
            </p>
          ) : jobs.length === 0 ? (
            <p className="dashboard-card-muted">
              No job postings yet. Contact support or an Admin to post jobs for students.
            </p>
          ) : (
            <ul className="dashboard-job-list">
              {jobs.map((job) => (
                <li key={job.jobId || job._id || job.id}>
                  <span className="dashboard-job-title">
                    {job.jobTitle || job.title || 'Untitled'}
                  </span>
                  <span className={`dashboard-job-badge dashboard-job-badge-${(job.status || 'Active').toLowerCase()}`}>
                    {job.status || 'Active'}
                  </span>
                  {job.lastApplicationDate && (
                    <span className="dashboard-job-date">
                      Last date: {new Date(job.lastApplicationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashboard-card dashboard-card-disabled">
          <h3>Applications (coming soon)</h3>
          <p>Review, shortlist, and hire candidates from your job applications.</p>
        </div>
      </div>
    </div>
  );
}

