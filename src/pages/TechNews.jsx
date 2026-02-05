import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCalendar, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { fetchTechNews } from '../api/techNews';
import { handleApiError } from '../utils/errorHandler';
import './TechNews.css';

const PAGE_SIZE = 10;

function safeText(v) {
  return typeof v === 'string' ? v : '';
}

function formatDate(pubDate, pubDateTZ) {
  const raw = safeText(pubDate);
  if (!raw) return '';
  // NewsData format often: "2026-02-05 01:37:14"
  const isoGuess = raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z';
  const d = new Date(isoGuess);
  if (Number.isNaN(d.getTime())) return raw + (pubDateTZ ? ` (${pubDateTZ})` : '');
  return d.toLocaleString();
}

export default function TechNews() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTechNews();
      const results = Array.isArray(data?.results) ? data.results : [];
      setItems(results);
      setPage(1);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await fetchTechNews({ signal: controller.signal });
        const results = Array.isArray(data?.results) ? data.results : [];
        setItems(results);
        setPage(1);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        toast.error(handleApiError(err));
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="technews-page">
      <div className="technews-hero">
        <div>
          <h1>Tech News</h1>
          <p className="technews-subtitle">
            Daily tech updates fetched from NewsData API.
          </p>
        </div>
        <button
          type="button"
          className="technews-refresh"
          onClick={load}
          disabled={loading}
        >
          <FiRefreshCw size={16} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="page-loading">
          <div className="spinner" />
          <p>Loading tech news…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="technews-empty">
          <p>No news found right now. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="technews-grid">
            {pagedItems.map((n) => {
              const title = safeText(n.title) || 'Untitled';
              const desc = safeText(n.description);
              const link = safeText(n.link);
              const imageUrl = safeText(n.image_url);
              const source = safeText(n.source_name) || safeText(n.source_id);
              const dateText = formatDate(n.pubDate, n.pubDateTZ);

              return (
                <article key={n.article_id || link || title} className="technews-card">
                  {imageUrl ? (
                    <div className="technews-imageWrap">
                      <img src={imageUrl} alt={title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="technews-imageFallback" aria-hidden="true" />
                  )}

                  <div className="technews-cardBody">
                    <div className="technews-meta">
                      {source && <span className="technews-source">{source}</span>}
                      {dateText && (
                        <span className="technews-date">
                          <FiCalendar size={14} />
                          {dateText}
                        </span>
                      )}
                    </div>

                    <h3 className="technews-title">{title}</h3>
                    {desc && <p className="technews-desc">{desc}</p>}

                    {link && (
                      <a
                        className="technews-link"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read full article <FiExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="technews-pagination">
            <button
              type="button"
              className="technews-pageBtn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <div className="technews-pageInfo">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>

            <button
              type="button"
              className="technews-pageBtn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

