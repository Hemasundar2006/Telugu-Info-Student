import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { listApprovedDocuments } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import { FiFileText, FiAward } from 'react-icons/fi';
import './Documents.css';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('hall-tickets');
  const [hallTickets, setHallTickets] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (user?.state) params.state = user.state;
        const res = await listApprovedDocuments(params);
        const allDocs = res?.data ?? [];
        setHallTickets(allDocs.filter((d) => d.docType === 'HALL_TICKET'));
        setResults(allDocs.filter((d) => d.docType === 'RESULT'));
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.state]);

  const currentDocs = activeTab === 'hall-tickets' ? hallTickets : results;
  const filteredDocs = search
    ? currentDocs.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()))
    : currentDocs;

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <h1>Documents</h1>
      <p className="section-desc">View and download hall tickets and results.</p>

      <div className="doc-tabs">
        <button
          type="button"
          className={`doc-tab ${activeTab === 'hall-tickets' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('hall-tickets');
            setSearch('');
          }}
        >
          <FiFileText size={18} />
          Hall Tickets
        </button>
        <button
          type="button"
          className={`doc-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('results');
            setSearch('');
          }}
        >
          <FiAward size={18} />
          Results
        </button>
      </div>

      <div className="doc-filters">
        <input
          type="search"
          placeholder={`Search ${activeTab === 'hall-tickets' ? 'hall tickets' : 'results'} by title...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <p className="doc-section-empty">
          No {activeTab === 'hall-tickets' ? 'hall tickets' : 'results'} available yet.
        </p>
      ) : (
        <div className="doc-grid">
          {filteredDocs.map((doc) => (
            <div key={doc._id} className="doc-card">
              <span className="doc-type">{DOC_TYPE_LABELS[doc.docType] || doc.docType}</span>
              <h3>{doc.title}</h3>
              <p className="doc-meta">
                {STATE_LABELS[doc.state]} • {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View / Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
