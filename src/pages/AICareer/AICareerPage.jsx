import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { listApprovedDocuments } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPE_LABELS, STATE_LABELS } from '../../utils/constants';
import { FiTarget, FiMap } from 'react-icons/fi';
import AiCareer from './AiCareer';
import './AICareerPage.css';

export default function AICareerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('career');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'roadmaps') {
      loadRoadmaps();
    }
  }, [activeTab, user?.state]);

  const loadRoadmaps = async () => {
    setLoadingRoadmaps(true);
    try {
      const params = {};
      if (user?.state) params.state = user.state;
      const res = await listApprovedDocuments(params);
      const roadmapDocs = (res?.data ?? []).filter((d) => d.docType === 'ROADMAP');
      setRoadmaps(roadmapDocs);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoadingRoadmaps(false);
    }
  };

  const filteredRoadmaps = search
    ? roadmaps.filter((d) => d.title?.toLowerCase().includes(search.toLowerCase()))
    : roadmaps;

  return (
    <div className="ai-career-page">
      <h1>AI Career</h1>
      <p className="section-desc">Get AI-powered career guidance and view roadmaps</p>

      <div className="ai-career-tabs">
        <button
          type="button"
          className={`ai-career-tab ${activeTab === 'career' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('career');
            setSearch('');
          }}
        >
          <FiTarget size={18} />
          AI Career Guidance
        </button>
        <button
          type="button"
          className={`ai-career-tab ${activeTab === 'roadmaps' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('roadmaps');
            setSearch('');
          }}
        >
          <FiMap size={18} />
          Roadmaps
        </button>
      </div>

      {activeTab === 'career' && <AiCareer />}

      {activeTab === 'roadmaps' && (
        <div className="roadmaps-section">
          <div className="doc-filters">
            <input
              type="search"
              placeholder="Search roadmaps by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {loadingRoadmaps ? (
            <div className="page-loading">
              <div className="spinner" />
              <p>Loading roadmaps...</p>
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <p className="doc-section-empty">No roadmaps available yet.</p>
          ) : (
            <div className="doc-grid">
              {filteredRoadmaps.map((doc) => (
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
      )}
    </div>
  );
}
