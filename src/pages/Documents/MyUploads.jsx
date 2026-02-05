import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getPendingDocuments } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import './Documents.css';

export default function MyUploads() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPendingDocuments();
        const all = res?.data ?? [];
        const mine = all.filter((d) => {
          const uid = d.uploadedBy?._id ?? d.uploadedBy?.id ?? d.uploadedBy;
          return uid === user?.id || uid === user?._id;
        });
        setDocs(mine);
      } catch (err) {
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, user?._id]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading your uploads...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <h1>My Uploads</h1>
      <p className="section-desc">Documents you uploaded (pending approval)</p>

      {docs.length === 0 ? (
        <p className="empty-state">You have no pending uploads.</p>
      ) : (
        <div className="doc-grid">
          {docs.map((doc) => (
            <div key={doc._id} className="doc-card">
              <span className="doc-type">{DOC_TYPE_LABELS[doc.docType] || doc.docType}</span>
              <span className="doc-status pending">PENDING</span>
              <h3>{doc.title}</h3>
              <p className="doc-meta">
                {STATE_LABELS[doc.state]} • {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              <p className="doc-note">Waiting for Super Admin approval.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
