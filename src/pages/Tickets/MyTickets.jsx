import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyTickets } from '../../api/tickets';
import { handleApiError } from '../../utils/errorHandler';
import { TICKET_STATUSES } from '../../utils/constants';
import './Tickets.css';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyTickets();
        setTickets(res?.data ?? []);
      } catch (err) {
        if (err?.error?.includes?.('404') || err?.message?.includes?.('404')) {
          setTickets([]);
        } else {
          toast.error(handleApiError(err));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <h1>My Tickets</h1>
      <p className="section-desc">Your support requests</p>

      {tickets.length === 0 ? (
        <p className="empty-state">No tickets yet. Create one from Create Ticket.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map((t) => (
            <div key={t._id} className="ticket-card">
              <span className={`ticket-status ${t.status?.toLowerCase()}`}>
                {t.status || 'OPEN'}
              </span>
              <h3>{t.title}</h3>
              {t.description && <p className="ticket-desc">{t.description}</p>}
              <p className="ticket-meta">
                Created {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '–'}
              </p>
              <div className="ticket-actions">
                <Link to={`/tickets/${t._id}/chat`} className="btn-chat-sm">
                  Open Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
