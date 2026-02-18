import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { createTicket, getMyTickets } from '../../api/tickets';
import { handleApiError } from '../../utils/errorHandler';
import { TICKET_STATUSES } from '../../utils/constants';
import { FiPlusCircle, FiMessageSquare } from 'react-icons/fi';
import './Tickets.css';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
});

export default function TicketsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  useEffect(() => {
    if (activeTab === 'list') {
      loadTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'create' || tab === 'list') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const loadTickets = async () => {
    setLoading(true);
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

  const onSubmit = async (data) => {
    try {
      await createTicket({ title: data.title, description: data.description || undefined });
      toast.success('Ticket created successfully. Support will contact you soon.');
      reset();
      setActiveTab('list');
      loadTickets();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="tickets-page">
      <h1>Tickets</h1>
      <p className="section-desc">Create support tickets and view your requests</p>

      <div className="ticket-tabs">
        <button
          type="button"
          className={`ticket-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <FiPlusCircle size={18} />
          Create Ticket
        </button>
        <button
          type="button"
          className={`ticket-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <FiMessageSquare size={18} />
          My Tickets
        </button>
      </div>

      {activeTab === 'create' && (
        <form onSubmit={handleSubmit(onSubmit)} className="form-card">
          <div className="form-group">
            <label>Title *</label>
            <input {...register('title')} placeholder="Brief title" />
            {formState.errors.title && (
              <span className="error">{formState.errors.title.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea {...register('description')} rows={4} placeholder="More details..." />
          </div>
          <button type="submit" className="btn-primary" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      )}

      {activeTab === 'list' && (
        <>
          {loading ? (
            <div className="page-loading">
              <div className="spinner" />
              <p>Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <p className="empty-state">No tickets yet. Create one from Create Ticket tab.</p>
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
        </>
      )}
    </div>
  );
}
