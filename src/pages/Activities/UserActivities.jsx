import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserActivities } from '../../api/activities';
import { handleApiError } from '../../utils/errorHandler';
import { format } from 'date-fns';
import './Activities.css';

export default function UserActivities() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ data: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await getUserActivities(userId, { page: data.page, limit: 30 });
        if (!cancelled) {
          setData({
            data: res?.data ?? [],
            page: res?.page ?? 1,
            pages: res?.pages ?? 1,
            total: res?.total ?? 0,
          });
        }
      } catch (err) {
        if (!cancelled) toast.error(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userId, data.page]);

  if (!userId) return null;

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading user activities...</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>User Activities</h1>
      <p className="section-desc">User ID: {userId} • Total: {data.total}</p>

      {data.data.length === 0 ? (
        <p className="empty-state">No activities.</p>
      ) : (
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((a) => (
                <tr key={a._id}>
                  <td>{a.createdAt ? format(new Date(a.createdAt), 'yyyy-MM-dd HH:mm') : '–'}</td>
                  <td>{a.action || '–'}</td>
                  <td>{a.resourceType || '–'}</td>
                  <td>{a.description || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.pages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => setData((d) => ({ ...d, page: d.page - 1 }))}
          >
            Previous
          </button>
          <span>Page {data.page} of {data.pages}</span>
          <button
            type="button"
            disabled={data.page >= data.pages}
            onClick={() => setData((d) => ({ ...d, page: d.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
