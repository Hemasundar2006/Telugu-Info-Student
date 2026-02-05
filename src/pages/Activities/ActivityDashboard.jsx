import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getDashboardActivities } from '../../api/activities';
import { handleApiError } from '../../utils/errorHandler';
import { ACTIONS, RESOURCE_TYPES, ROLES } from '../../utils/constants';
import { format } from 'date-fns';
import './Activities.css';

export default function ActivityDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    action: '',
    resourceType: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50,
  });

  const load = async () => {
    try {
      const params = { ...filters };
      if (!params.role) delete params.role;
      if (!params.action) delete params.action;
      if (!params.resourceType) delete params.resourceType;
      if (!params.startDate) delete params.startDate;
      if (!params.endDate) delete params.endDate;
      const res = await getDashboardActivities(params);
      setData({
        data: res?.data ?? [],
        total: res?.total ?? 0,
        page: res?.page ?? 1,
        pages: res?.pages ?? 1,
      });
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.page, filters.role, filters.action, filters.resourceType, filters.startDate, filters.endDate]);

  const handleUserClick = (userId) => {
    if (userId) navigate(`/activities/user/${userId}`);
  };

  return (
    <div className="activities-page">
      <h1>Activity Dashboard</h1>
      <p className="section-desc">Filter and view activity log</p>

      <div className="activity-filters">
        <select
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value, page: 1 }))}
          className="select-filter"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filters.action}
          onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value, page: 1 }))}
          className="select-filter"
        >
          <option value="">All actions</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filters.resourceType}
          onChange={(e) => setFilters((f) => ({ ...f, resourceType: e.target.value, page: 1 }))}
          className="select-filter"
        >
          <option value="">All resource types</option>
          {RESOURCE_TYPES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value, page: 1 }))}
          className="search-input"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value, page: 1 }))}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /><p>Loading...</p></div>
      ) : (
        <>
          <p className="section-desc">Total: {data.total}</p>
          <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Description</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((a) => (
                  <tr key={a._id}>
                    <td>{a.createdAt ? format(new Date(a.createdAt), 'yyyy-MM-dd HH:mm') : '–'}</td>
                    <td>
                      {a.userId?._id || a.userId?.id ? (
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => handleUserClick(a.userId?._id || a.userId?.id)}
                        >
                          {a.userName || a.userId?.name || '–'}
                        </button>
                      ) : (
                        a.userName || '–'
                      )}
                    </td>
                    <td>{a.userRole || '–'}</td>
                    <td>{a.action || '–'}</td>
                    <td>{a.resourceType || '–'}</td>
                    <td>{a.description || '–'}</td>
                    <td>{a.ipAddress || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.pages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Previous
              </button>
              <span>Page {filters.page} of {data.pages}</span>
              <button
                type="button"
                disabled={filters.page >= data.pages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
