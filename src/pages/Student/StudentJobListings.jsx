import { useEffect, useState } from 'react';
import { getJobListings } from '../../api/studentJobs';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { FiBriefcase } from 'react-icons/fi';
import { JOB_CATEGORIES } from '../../utils/jobPostingConstants';
import '../Jobs/Jobs.css';

export default function StudentJobListings() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (category) params.category = category;
        const res = await getJobListings(params);
        if (cancelled) return;
        if (res?.success) {
          setJobs(res.jobs || []);
          setTotal(res.total ?? 0);
          setTotalPages(res.totalPages ?? 1);
        } else {
          toast.error(res?.error || 'Failed to load jobs');
        }
      } catch (err) {
        if (!cancelled) toast.error(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, category]);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatSalary = (job) => {
    if (job.jobCategory === 'Private' && job.privateJobFields?.salaryRange) {
      const s = job.privateJobFields.salaryRange;
      const min = (s.min / 100000).toFixed(1);
      const max = (s.max / 100000).toFixed(1);
      return `₹${min}–${max} Lakh ${s.payStructure || 'CTC'}`;
    }
    if (job.jobCategory === 'Government' && job.govtJobFields?.payScale) {
      const p = job.govtJobFields.payScale;
      return `₹${p.min}–${p.max}`;
    }
    return null;
  };

  return (
    <div className="dashboard-page">
      <h1>Job listings</h1>
      <p className="dashboard-subtitle">Jobs matching your qualification. Apply before the last date.</p>

      <div className="jobs-filters">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="jobs-select"
          aria-label="Filter by category"
        >
          <option value="">All</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
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
          <p>No matching jobs right now. Check back later or update your profile qualification.</p>
        </div>
      ) : (
        <>
          <div className="job-listings-grid">
            {jobs.map((job) => (
              <article key={job.jobId} className="job-listing-card">
                <h3>{job.jobTitle}</h3>
                <p className="job-org">{job.organization}</p>
                <p className="job-meta">
                  {job.jobCategory}
                  {job.privateJobFields?.workMode && ` · ${job.privateJobFields.workMode}`}
                  {job.privateJobFields?.jobLocation?.length > 0 && ` · ${job.privateJobFields.jobLocation.join(', ')}`}
                </p>
                {formatSalary(job) && <p className="job-meta">{formatSalary(job)}</p>}
                <p className="job-deadline">Last date: {formatDate(job.lastApplicationDate)}</p>
                {job.privateJobFields?.applicationLink && (
                  <a
                    href={job.privateJobFields.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Apply
                  </a>
                )}
                {job.govtJobFields?.officialLink && (
                  <a
                    href={job.govtJobFields.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Official link
                  </a>
                )}
              </article>
            ))}
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
              <span className="jobs-pagination-info">Page {page} of {totalPages} ({total} jobs)</span>
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
