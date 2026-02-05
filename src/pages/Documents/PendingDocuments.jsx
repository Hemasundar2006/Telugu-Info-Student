import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getPendingDocuments, approveDocument } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import './Documents.css';

export default function PendingDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [filterState, setFilterState] = useState('');
  const [filterType, setFilterType] = useState('');

  const load = async () => {
    try {
      const res = await getPendingDocuments();
      setDocs(res?.data ?? []);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    setApproving(id);
    try {
      await approveDocument(id);
      toast.success('Document approved');
      setDocs((prev) => prev.filter((d) => d._id !== id));
      setConfirmId(null);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setApproving(null);
    }
  };

  const filtered = docs.filter((d) => {
    if (filterState && d.state !== filterState) return false;
    if (filterType && d.docType !== filterType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading pending documents...</p>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <h1>Pending Documents</h1>
      <p className="section-desc">Count: {filtered.length}</p>

      <div className="doc-filters">
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="select-filter">
          <option value="">All states</option>
          <option value="AP">AP</option>
          <option value="TS">TS</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="select-filter">
          <option value="">All types</option>
          <option value="HALL_TICKET">Hall Ticket</option>
          <option value="RESULT">Result</option>
          <option value="ROADMAP">Roadmap</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No pending documents.</p>
      ) : (
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>State</th>
                <th>Uploaded by</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc._id}>
                  <td>{doc.title}</td>
                  <td>{DOC_TYPE_LABELS[doc.docType] || doc.docType}</td>
                  <td>{STATE_LABELS[doc.state]}</td>
                  <td>
                    {doc.uploadedBy?.name ?? doc.uploadedBy?.phone ?? doc.uploadedBy ?? '–'}
                  </td>
                  <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '–'}</td>
                  <td>
                    {confirmId === doc._id ? (
                      <span className="confirm-actions">
                        <button
                          type="button"
                          className="btn-danger-sm"
                          onClick={() => handleApprove(doc._id)}
                          disabled={approving === doc._id}
                        >
                          {approving === doc._id ? '...' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-sm"
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary-sm"
                        onClick={() => setConfirmId(doc._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
