import { Link } from 'react-router-dom';
import './UserStatsCard.css';

export default function UserStatsCard({
  userId,
  name,
  role,
  profileImage,
  followersCount,
  followingCount,
  postsCount,
  isVerified,
  showFollowButton,
  isFollowing,
  followLoading,
  onToggleFollow,
}) {
  return (
    <div className="user-stats-card">
      <div className="user-stats-header">
        <div className="user-stats-avatar">
          {profileImage ? (
            <img src={profileImage} alt={name || 'User'} />
          ) : (
            <div className="user-stats-avatar-fallback" aria-hidden />
          )}
        </div>

        <div className="user-stats-meta">
          <div className="user-stats-name-row">
            <h2 className="user-stats-name">
              {name || 'User'}
              {isVerified && (
                <img
                  src="/verified.png"
                  alt="Verified"
                  className="user-stats-verified"
                />
              )}
            </h2>
            {role && <span className="user-stats-role">{role}</span>}
          </div>
          <div className="user-stats-id">ID: {userId}</div>
        </div>

        {showFollowButton && (
          <button
            type="button"
            className={`user-stats-follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={onToggleFollow}
            disabled={followLoading}
          >
            {followLoading ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="user-stats-grid">
        <Link to="#" className="user-stats-metric" onClick={(e) => e.preventDefault()}>
          <div className="user-stats-metric-value">{followersCount ?? 0}</div>
          <div className="user-stats-metric-label">Followers</div>
        </Link>
        <Link to="#" className="user-stats-metric" onClick={(e) => e.preventDefault()}>
          <div className="user-stats-metric-value">{followingCount ?? 0}</div>
          <div className="user-stats-metric-label">Following</div>
        </Link>
        <Link to="/posts" className="user-stats-metric">
          <div className="user-stats-metric-value">{postsCount ?? 0}</div>
          <div className="user-stats-metric-label">Posts</div>
        </Link>
      </div>
    </div>
  );
}

