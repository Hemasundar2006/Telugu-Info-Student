import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getSuperAdminTickets } from '../../api/tickets';
import { handleApiError } from '../../utils/errorHandler';
import { STATE_LABELS } from '../../utils/constants';
import './Tickets.css';

export default function CompletedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSuperAdminTickets();
        setTickets(res?.data ?? []);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = tickets.filter((t) => {
    if (!filterDate) return true;
    const d = t.completedAt || t.updatedAt || t.createdAt;
    if (!d) return false;
    return new Date(d).toISOString().slice(0, 10) === filterDate;
  });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading completed tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <h1>Completed Tickets</h1>
      <p className="section-desc">Resolved support tickets</p>

      <div className="doc-filters">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No completed tickets.</p>
      ) : (
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Created by</th>
                <th>Assigned to</th>
                <th>Completed by</th>
                <th>Completed at</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.createdBy?.name ?? t.createdBy?.phone ?? '–'}</td>
                  <td>{t.assignedTo?.name ?? t.assignedTo?.phone ?? '–'}</td>
                  <td>{t.completedBy?.name ?? t.completedBy?.phone ?? '–'}</td>
                  <td>
                    {t.completedAt
                      ? new Date(t.completedAt).toLocaleString()
                      : '–'}
                  </td>
                  <td>{t.resolutionNote || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
