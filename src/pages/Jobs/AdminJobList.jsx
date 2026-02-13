import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getJobs,
  deleteJob,
} from '../../api/adminJobs';
import { handleApiError } from '../../utils/errorHandler';
import {
  JOB_CATEGORIES,
  JOB_STATUSES,
} from '../../utils/jobPostingConstants';
import toast from 'react-hot-toast';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import './Jobs.css';

export default function AdminJobList() {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (status) params.status = status;
      const res = await getJobs(params);
      if (res?.success) {
        setJobs(res.jobs || []);
        setTotalJobs(res.totalJobs ?? 0);
        setTotalPages(res.totalPages ?? 1);
      } else {
        toast.error(res?.error || 'Failed to load jobs');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, category, status]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Close this job? Students can still see it in history.')) return;
    setDeletingId(jobId);
    try {
      const res = await deleteJob(jobId);
      if (res?.success) {
        toast.success(res.message || 'Job closed');
        fetchJobs();
      } else {
        toast.error(res?.error || 'Failed to close job');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard-page jobs-page">
      <div className="jobs-page-header">
        <h1>Job Postings</h1>
        <p className="dashboard-subtitle">Create and manage jobs. Matching students get dashboard notifications.</p>
        <Link to="/admin/jobs/new" className="btn btn-primary jobs-create-btn">
          <FiPlus size={20} />
          Post new job
        </Link>
      </div>

      <div className="jobs-filters">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="jobs-select"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="jobs-select"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="jobs-loading">
          <div className="spinner" />
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="jobs-empty">
          <FiBriefcase size={48} />
          <p>No jobs found. Post your first job to notify matching students.</p>
          <Link to="/admin/jobs/new" className="btn btn-primary">Post new job</Link>
        </div>
      ) : (
        <>
          <div className="jobs-table-wrap">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Organization</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Notified</th>
                  <th>Last date</th>
                  <th>Posted</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.jobId}>
                    <td>
                      <Link to={`/admin/jobs/${job.jobId}`} className="jobs-link">
                        {job.jobTitle}
                      </Link>
                    </td>
                    <td>{job.organization}</td>
                    <td>{job.jobCategory}</td>
                    <td>
                      <span className={`jobs-badge jobs-badge-${(job.status || 'Active').toLowerCase()}`}>
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td>{job.totalNotified ?? '—'}</td>
                    <td>{formatDate(job.lastApplicationDate)}</td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <div className="jobs-actions">
                        <Link
                          to={`/admin/jobs/${job.jobId}`}
                          className="jobs-action-btn"
                          title="View"
                          aria-label="View job"
                        >
                          <FiEye size={18} />
                        </Link>
                        <Link
                          to={`/admin/jobs/${job.jobId}/edit`}
                          className="jobs-action-btn"
                          title="Edit"
                          aria-label="Edit job"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button
                          type="button"
                          className="jobs-action-btn jobs-action-btn-danger"
                          title="Close job"
                          aria-label="Close job"
                          onClick={() => handleDelete(job.jobId)}
                          disabled={deletingId === job.jobId}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="jobs-pagination">
              <button
                type="button"
                className="btn btn-outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="jobs-pagination-info">
                Page {page} of {totalPages} ({totalJobs} jobs)
              </span>
              <button
                type="button"
                className="btn btn-outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
