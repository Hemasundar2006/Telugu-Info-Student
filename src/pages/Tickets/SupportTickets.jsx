import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSupportTickets, assignTicket, completeTicket } from '../../api/tickets';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../utils/errorHandler';
import { STATE_LABELS } from '../../utils/constants';
import './Tickets.css';

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    try {
      const res = await getSupportTickets();
      setTickets(res?.data ?? []);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAssign = async (id) => {
    setActioning(id);
    try {
      await assignTicket(id);
      toast.success('Ticket assigned to you');
      load();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActioning(null);
    }
  };

  const handleComplete = async () => {
    if (!completeModal) return;
    const id = completeModal._id;
    setActioning(id);
    try {
      await completeTicket(id, { resolutionNote: resolutionNote || undefined });
      toast.success('Ticket completed');
      setCompleteModal(null);
      setResolutionNote('');
      load();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setActioning(null);
    }
  };

  const filtered = tickets.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  const canAssign = (t) => t.status === 'OPEN';
  const canComplete = (t) =>
    t.status === 'IN_PROGRESS' && (t.assignedTo?._id === user?.id || t.assignedTo === user?.id);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <h1>Support Tickets</h1>
      <p className="section-desc">Count: {filtered.length}</p>

      <div className="doc-filters">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select-filter"
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No tickets.</p>
      ) : (
        <div className="ticket-list">
          {filtered.map((t) => (
            <div key={t._id} className="ticket-card support-ticket">
              <span className={`ticket-status ${(t.status || '').toLowerCase()}`}>
                {t.status || 'OPEN'}
              </span>
              <h3>{t.title}</h3>
              {t.description && <p className="ticket-desc">{t.description}</p>}
              <p className="ticket-meta">
                By {t.createdBy?.name ?? t.createdBy?.phone ?? '–'} •{' '}
                {t.createdBy?.state ? STATE_LABELS[t.createdBy.state] : ''} •{' '}
                {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '–'}
              </p>
              <div className="ticket-actions">
                {canAssign(t) && (
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={() => handleAssign(t._id)}
                    disabled={actioning === t._id}
                  >
                    {actioning === t._id ? '...' : 'Assign to Me'}
                  </button>
                )}
                {canComplete(t) && (
                  <button
                    type="button"
                    className="btn-success-sm"
                    onClick={() => setCompleteModal(t)}
                  >
                    Complete
                  </button>
                )}
                <Link to={`/tickets/${t._id}/chat`} className="btn-chat-sm">
                  Open Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {completeModal && (
        <div className="modal-backdrop" onClick={() => setCompleteModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Complete Ticket</h3>
            <p>{completeModal.title}</p>
            <div className="form-group">
              <label>Resolution note (optional)</label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
                placeholder="How was it resolved?"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setCompleteModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleComplete}
                disabled={actioning === completeModal._id}
              >
                {actioning === completeModal._id ? 'Completing...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
