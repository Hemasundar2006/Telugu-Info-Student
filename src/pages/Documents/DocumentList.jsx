import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { listApprovedDocuments } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import { FiFileText, FiAward, FiMap } from 'react-icons/fi';
import './Documents.css';

export default function DocumentList() {
  const { user } = useAuth();
  const { hash } = useLocation();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash, loading]);

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (user?.state) params.state = user.state;
        const res = await listApprovedDocuments(params);
        setDocs(res?.data ?? []);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.state]);

  const filterBySearch = (list) =>
    search
      ? list.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()))
      : list;

  const hallTickets = filterBySearch(docs.filter((d) => d.docType === 'HALL_TICKET'));
  const results = filterBySearch(docs.filter((d) => d.docType === 'RESULT'));
  const roadmaps = filterBySearch(docs.filter((d) => d.docType === 'ROADMAP'));

  const DocCard = ({ doc }) => (
    <div className="doc-card">
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
  );

  const Section = ({ id, title, description, icon: Icon, items, emptyMsg }) => (
    <section className="doc-section" id={id}>
      <h2 className="doc-section-title">
        {Icon && <Icon className="doc-section-icon" size={22} />}
        {title}
      </h2>
      {description && <p className="doc-section-desc">{description}</p>}
      {items.length === 0 ? (
        <p className="doc-section-empty">{emptyMsg}</p>
      ) : (
        <div className="doc-grid">
          {items.map((doc) => (
            <DocCard key={doc._id} doc={doc} />
          ))}
        </div>
      )}
    </section>
  );

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
      <p className="section-desc">Hall tickets, results & roadmaps for your state</p>

      <div className="doc-filters">
        <input
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <Section
        id="hall-tickets"
        title="Hall Tickets"
        description="View and download any available hall ticket here."
        icon={FiFileText}
        items={hallTickets}
        emptyMsg="No hall tickets available yet."
      />

      <Section
        id="results"
        title="Results"
        description="View and download any available result here."
        icon={FiAward}
        items={results}
        emptyMsg="No results available yet."
      />

      <Section
        id="roadmaps"
        title="Roadmaps"
        description="View and download any available roadmap here."
        icon={FiMap}
        items={roadmaps}
        emptyMsg="No roadmaps available yet."
      />
    </div>
  );
}
