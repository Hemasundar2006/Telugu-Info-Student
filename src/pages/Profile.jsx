import { useAuth } from '../context/AuthContext';
import { TIER_LABELS, STATE_LABELS } from '../utils/constants';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-card">
        <dl className="profile-dl">
          <dt>Name</dt>
          <dd>{user?.name ?? '–'}</dd>
          <dt>Email</dt>
          <dd>{user?.email ?? '–'}</dd>
          <dt>Phone</dt>
          <dd>{user?.phone ?? '–'}</dd>
          <dt>Role</dt>
          <dd>{user?.role ?? '–'}</dd>
          <dt>State</dt>
          <dd>{user?.state ? STATE_LABELS[user.state] : '–'}</dd>
          <dt>Tier</dt>
          <dd>{user?.tier ? TIER_LABELS[user.tier] : '–'}</dd>
        </dl>
      </div>
    </div>
  );
}
