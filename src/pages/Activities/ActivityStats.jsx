import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getActivityStats } from '../../api/activities';
import { handleApiError } from '../../utils/errorHandler';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import './Activities.css';

const COLORS = ['#ea580c', '#0F766E', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ActivityStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await getActivityStats(params);
      setStats(res?.stats ?? null);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading statistics...</p>
      </div>
    );
  }

  const byRole = stats?.byRole ?? [];
  const byAction = stats?.byAction ?? [];
  const byResource = stats?.byResourceType ?? [];
  const recent = stats?.recentActivities ?? [];

  return (
    <div className="activities-page">
      <h1>Activity Statistics</h1>
      <p className="section-desc">Charts and recent activity</p>

      <div className="activity-filters">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stat-cards-row">
        <div className="stat-card big">
          <span className="stat-value">{stats?.totalActivities ?? 0}</span>
          <span className="stat-label">Total Activities</span>
        </div>
      </div>

      <div className="charts-row">
        {byRole.length > 0 && (
          <div className="chart-card">
            <h3>By Role</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byRole.map((r) => ({ name: r._id, value: r.count }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {byRole.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {byResource.length > 0 && (
          <div className="chart-card">
            <h3>By Resource Type</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byResource.map((r) => ({ name: r._id, value: r.count }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {byResource.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {byAction.length > 0 && (
        <div className="chart-card full">
          <h3>By Action</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byAction.map((a) => ({ name: a._id, count: a.count }))} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ea580c" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {recent.length === 0 ? (
          <p className="empty-state">No recent activities.</p>
        ) : (
          <ul className="recent-list">
            {recent.slice(0, 10).map((a) => (
              <li key={a._id}>
                <span className="recent-time">
                  {a.createdAt ? format(new Date(a.createdAt), 'yyyy-MM-dd HH:mm') : '–'}
                </span>
                <span className="recent-desc">
                  {a.userName || 'User'} – {a.action} ({a.resourceType})
                  {a.description ? `: ${a.description}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
