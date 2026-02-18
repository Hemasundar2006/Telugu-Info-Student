import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/users';
import { handleApiError } from '../utils/errorHandler';
import UserStatsCard from '../components/UserStatsCard';
import './Profile.css';

export default function MyProfileOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?._id || user?.id;

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await getUserProfile(userId);
        const data = res?.data || res;
        setProfile(data || null);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (!user) {
    return (
      <div className="profile-page">
        <h1>My Profile</h1>
        <p className="profile-helper-text">Please log in to view your profile.</p>
      </div>
    );
  }

  const baseUser = profile?.user || profile || {};
  const counts = profile?.counts || profile || {};
  const headerName =
    baseUser.companyName || baseUser.fullName || baseUser.name || user?.name || 'User';
  const headerRole = baseUser.role || user?.role || '';
  const headerImage = baseUser.profileImage || baseUser.profilePhoto || '';
  const headerEmail = baseUser.email || user?.email || '';
  const headerState = baseUser.state || '';
  const hasPaidPlan =
    profile?.plan?.isPaid === true ||
    baseUser.plan?.isPaid === true ||
    baseUser.hasPaidPlan === true ||
    baseUser.isPaid === true;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      {loading ? (
        <div className="profile-card">
          <p>Loading your profile...</p>
        </div>
      ) : error ? (
        <div className="profile-card">
          <p className="profile-alert profile-alert-error">{error}</p>
        </div>
      ) : (
        <>
          <UserStatsCard
            userId={userId}
            name={headerName}
            role={headerRole}
            profileImage={headerImage}
            followersCount={counts.followersCount}
            followingCount={counts.followingCount}
            postsCount={counts.postsCount}
            isVerified={hasPaidPlan}
            showFollowButton={false}
          />

          <div className="profile-card" style={{ marginTop: '1rem' }}>
            <div className="profile-grid">
              {headerEmail && (
                <div className="profile-field">
                  <span>Email</span>
                  <div>{headerEmail}</div>
                </div>
              )}
              {headerState && (
                <div className="profile-field">
                  <span>State</span>
                  <div>{headerState}</div>
                </div>
              )}
              {Array.isArray(baseUser.skills) && baseUser.skills.length > 0 && (
                <div className="profile-field profile-field-full">
                  <span>Skills</span>
                  <div className="profile-skill-chips">
                    {baseUser.skills.slice(0, 10).map((s) => (
                      <span key={s} className="profile-skill-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-actions" style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="profile-btn primary"
                onClick={() => navigate('/profile')}
              >
                Edit details
              </button>
              <button
                type="button"
                className="profile-btn secondary"
                onClick={() => navigate(`/users/${userId}`)}
              >
                View public profile
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

