import { useEffect, useState } from 'react';
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from '../../api/studentNotifications';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';
import { FiBell, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../Jobs/Jobs.css';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filterRead === 'true') params.isRead = true;
      if (filterRead === 'false') params.isRead = false;
      const res = await getNotifications(params);
      if (res?.success) {
        setNotifications(res.notifications || []);
        setTotal(res.total ?? 0);
        setUnreadCount(res.unreadCount ?? 0);
        setTotalPages(res.totalPages ?? 1);
      } else {
        toast.error(res?.error || 'Failed to load notifications');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, filterRead]);

  const handleMarkRead = async (notificationId) => {
    try {
      const res = await markNotificationRead(notificationId);
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true, readAt: res.notification?.readAt } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const res = await deleteNotification(notificationId);
      if (res?.success) {
        setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
        toast.success('Notification deleted');
      } else {
        toast.error(res?.error || 'Delete failed');
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard-page">
      <h1>Job notifications</h1>
      <p className="dashboard-subtitle">
        You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
      </p>

      <div className="jobs-filters">
        <select
          value={filterRead}
          onChange={(e) => { setFilterRead(e.target.value); setPage(1); }}
          className="jobs-select"
          aria-label="Filter by read status"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {loading ? (
        <div className="jobs-loading">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="jobs-empty">
          <FiBell size={48} />
          <p>No notifications yet. When new jobs match your qualification, they will appear here.</p>
          <Link to="/student/jobs" className="btn btn-primary">Browse job listings</Link>
        </div>
      ) : (
        <>
          <ul className="notif-list">
            {notifications.map((n) => (
              <li key={n.notificationId} className={`notif-item ${n.isRead ? '' : 'unread'}`}>
                <h3>{n.title}</h3>
                <div className="notif-meta">
                  {n.jobTitle} · {n.organization} · {n.jobCategory}
                </div>
                <p className="notif-message">{n.message}</p>
                {n.importantDates && (n.importantDates.lastApplicationDate || n.importantDates.examDate) && (
                  <div className="notif-dates">
                    {n.importantDates.lastApplicationDate && (
                      <>Last date: {formatDate(n.importantDates.lastApplicationDate)}</>
                    )}
                    {n.importantDates.examDate && (
                      <> · Exam: {formatDate(n.importantDates.examDate)}</>
                    )}
                  </div>
                )}
                <div className="notif-actions">
                  {!n.isRead && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleMarkRead(n.notificationId)}
                    >
                      Mark read
                    </button>
                  )}
                  {n.jobId && (n.jobId.jobId || n.jobId._id) && (
                    <Link
                      to="/student/jobs"
                      className="btn btn-primary"
                    >
                      View job
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleDelete(n.notificationId)}
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

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
              <span className="jobs-pagination-info">Page {page} of {totalPages}</span>
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
