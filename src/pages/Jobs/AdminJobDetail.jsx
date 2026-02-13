import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getJobById } from '../../api/adminJobs';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';
import './Jobs.css';

export default function AdminJobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getJobById(jobId);
        if (cancelled) return;
        if (res?.success) {
          setJob(res.job);
          setNotificationStatus(res.notificationStatus || null);
        } else {
          toast.error(res?.error || 'Job not found');
        }
      } catch (err) {
        if (!cancelled) toast.error(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [jobId]);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="jobs-loading"><div className="spinner" /><p>Loading job...</p></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="dashboard-page">
        <p>Job not found.</p>
        <Link to="/admin/jobs" className="btn btn-outline">Back to jobs</Link>
      </div>
    );
  }

  const govt = job.govtJobFields;
  const priv = job.privateJobFields;

  return (
    <div className="dashboard-page job-detail-page">
      <div className="job-detail-header">
        <Link to="/admin/jobs" className="btn btn-outline job-detail-back">
          <FiArrowLeft size={18} /> Back to jobs
        </Link>
        <Link to={`/admin/jobs/${job.jobId}/edit`} className="btn btn-primary">
          <FiEdit2 size={18} /> Edit job
        </Link>
      </div>

      <h1>{job.jobTitle}</h1>
      <p className="dashboard-subtitle">{job.organization} · {job.jobCategory}</p>

      {notificationStatus && (
        <div className="job-detail-notif">
          <strong>Notification:</strong> Sent to {notificationStatus.totalSent ?? 0} students
          {notificationStatus.sentDate && ` on ${formatDate(notificationStatus.sentDate)}`}
          {notificationStatus.totalMatched != null && ` (${notificationStatus.totalMatched} matched)`}.
        </div>
      )}

      <div className="job-detail-section">
        <h2>Details</h2>
        <dl className="job-detail-dl">
          <dt>Job type</dt>
          <dd>{job.jobType || 'Full-time'}</dd>
          <dt>Target qualifications</dt>
          <dd>{(job.targetQualifications || []).join(', ') || '—'}</dd>
          <dt>Total positions</dt>
          <dd>{job.totalPositions}</dd>
          <dt>Last application date</dt>
          <dd>{formatDate(job.lastApplicationDate)}</dd>
          <dt>Status</dt>
          <dd><span className={`jobs-badge jobs-badge-${(job.status || 'active').toLowerCase()}`}>{job.status || 'Active'}</span></dd>
        </dl>
      </div>

      <div className="job-detail-section">
        <h2>Description</h2>
        <p className="job-detail-description">{job.jobDescription || '—'}</p>
      </div>

      {job.jobCategory === 'Government' && govt && (
        <div className="job-detail-section">
          <h2>Government details</h2>
          <dl className="job-detail-dl">
            <dt>Authority</dt>
            <dd>{govt.notifyingAuthority}</dd>
            <dt>Post code</dt>
            <dd>{govt.postCode}</dd>
            <dt>Grade</dt>
            <dd>{govt.grade}</dd>
            <dt>Pay scale</dt>
            <dd>₹{govt.payScale?.min} – ₹{govt.payScale?.max}</dd>
            <dt>Exam date</dt>
            <dd>{formatDate(govt.examDate)}</dd>
            <dt>Official link</dt>
            <dd><a href={govt.officialLink} target="_blank" rel="noopener noreferrer">{govt.officialLink}</a></dd>
          </dl>
        </div>
      )}

      {job.jobCategory === 'Private' && priv && (
        <div className="job-detail-section">
          <h2>Private job details</h2>
          <dl className="job-detail-dl">
            <dt>Work mode</dt>
            <dd>{priv.workMode}</dd>
            <dt>Location(s)</dt>
            <dd>{(priv.jobLocation || []).join(', ') || '—'}</dd>
            <dt>Salary</dt>
            <dd>₹{priv.salaryRange?.min} – ₹{priv.salaryRange?.max} ({priv.salaryRange?.payStructure})</dd>
            <dt>HR email</dt>
            <dd>{priv.hrContactEmail}</dd>
            <dt>HR phone</dt>
            <dd>{priv.hrContactPhone}</dd>
            {priv.applicationLink && (
              <>
                <dt>Application link</dt>
                <dd><a href={priv.applicationLink} target="_blank" rel="noopener noreferrer">Apply</a></dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
