import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { searchUsers } from '../api/users';
import { handleApiError } from '../utils/errorHandler';
import './Users/UserPublicProfile.css';

const getId = (u) => u?._id || u?.id || u?.userId;

export default function SearchPeople() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = (params.get('query') || '').trim();
  const roleFilter = (params.get('role') || '').trim();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await searchUsers(q, roleFilter ? { role: roleFilter } : {});
        const payload = res?.data || res;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setResults(list);
      } catch (err) {
        setError(handleApiError(err));
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q, roleFilter]);

  return (
    <div className="user-public-page">
      <h1>Search people</h1>
      <p className="section-desc">
        Showing results for <strong>{q || '...'}</strong>
        {roleFilter && <> ({roleFilter === 'COMPANY' ? 'Companies' : 'Students'})</>}
      </p>

      {loading && (
        <div className="page-loading">
          <div className="spinner" />
          <p>Searching...</p>
        </div>
      )}

      {error && !loading && (
        <div className="user-public-panel">
          <p className="user-public-hint">{error}</p>
        </div>
      )}

      {!loading && !error && q && results.length === 0 && (
        <div className="user-public-panel">
          <p className="user-public-hint">No people found.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="user-public-panel">
          <div className="user-list">
            {results.map((u) => {
              const id = getId(u);
              const name = u.companyName || u.fullName || u.name || 'User';
              const role = u.role || 'USER';
              const img = u.profileImage || u.profilePhoto || '';
              const isPaid =
                u.plan?.isPaid === true || u.hasPaidPlan === true || u.isPaid === true;
              return (
                <Link key={id || name} to={id ? `/users/${id}` : '#'} className="user-row">
                  <div className="user-row-avatar">
                    {img ? (
                      <img src={img} alt={name} />
                    ) : (
                      <div className="user-row-avatar-fallback" />
                    )}
                  </div>
                  <div className="user-row-main">
                    <div className="user-row-name">
                      {name}
                      {isPaid && (
                        <img
                          src="/verified.png"
                          alt="Verified"
                          style={{ width: 16, height: 16, marginLeft: 4 }}
                        />
                      )}
                    </div>
                    <div className="user-row-meta">
                      {role}{u.state ? ` • ${u.state}` : ''}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

