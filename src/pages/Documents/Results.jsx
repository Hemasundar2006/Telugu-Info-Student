import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { listApprovedDocuments } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import { FiAward } from 'react-icons/fi';
import './Documents.css';

export default function Results() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (user?.state) params.state = user.state;
        const res = await listApprovedDocuments(params);
        const results = (res?.data ?? []).filter((d) => d.docType === 'RESULT');
        setDocs(results);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.state]);

  const filteredDocs = search
    ? docs.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()))
    : docs;

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <h1>
        <FiAward className="doc-section-icon" size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
        Results
      </h1>
      <p className="section-desc">View and download any available result here.</p>

      <div className="doc-filters">
        <input
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <p className="doc-section-empty">No results available yet.</p>
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
