import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getFollowers, getFollowing, toggleFollow, getFollowStatus } from '../../api/follows';
import { getUserProfile } from '../../api/users';
import { getUserPosts } from '../../api/posts';
import { handleApiError } from '../../utils/errorHandler';
import UserStatsCard from '../../components/UserStatsCard';
import PostCard from '../../components/PostCard';
import './UserPublicProfile.css';

const getId = (u) => u?._id || u?.id || u?.userId || u?.targetUserId;
const getName = (u) => u?.name || u?.fullName || u?.companyName || 'User';
const getRole = (u) => u?.role || '';
const getImage = (u) => u?.profileImage || u?.profilePhoto || u?.image || '';

export default function UserPublicProfile() {
  const { user } = useAuth();
  const { userId } = useParams();

  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [activeTab, setActiveTab] = useState('overview'); // overview | posts | followers | following

  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [listLoading, setListLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [postsLoading, setPostsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);

  const isSelf = useMemo(() => {
    const me = user?._id || user?.id;
    return Boolean(me && userId && String(me) === String(userId));
  }, [user, userId]);

  const canUseFollow = Boolean(user);

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await getUserProfile(userId);
      // backend may wrap in { data } or return plain object
      const data = res?.data || res;
      setProfile(data || null);
      const base = data?.user || data;
      const followingFlag =
        typeof data?.isFollowing === 'boolean'
          ? data.isFollowing
          : typeof base?.isFollowing === 'boolean'
            ? base.isFollowing
            : false;
      setIsFollowing(followingFlag);
    } catch (err) {
      toast.error(handleApiError(err));
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const normalizeList = (res) => {
    if (!res) return { list: [], pages: 1 };
    const list =
      res.followers ||
      res.following ||
      res.users ||
      res.data ||
      (Array.isArray(res) ? res : []);
    const pages = res.totalPages ?? res.pages ?? 1;
    return { list: Array.isArray(list) ? list : [], pages: typeof pages === 'number' ? pages : 1 };
  };

  const loadPosts = async (nextPage = 1) => {
    setPostsLoading(true);
    try {
      const res = await getUserPosts(userId, { page: nextPage, limit: 10 });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.posts)
            ? res.posts
            : Array.isArray(res)
              ? res
              : [];
      setPosts(list);
      const pageNum = res?.page ?? res?.data?.page ?? nextPage;
      const pagesNum = res?.pages ?? res?.data?.pages ?? 1;
      setPostsPage(typeof pageNum === 'number' ? pageNum : nextPage);
      setPostsPages(typeof pagesNum === 'number' ? pagesNum : 1);
    } catch (err) {
      toast.error(handleApiError(err));
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadList = async (nextPage = 1) => {
    if (!canUseFollow) return;
    setListLoading(true);
    try {
      const apiCall = activeTab === 'followers' ? getFollowers : getFollowing;
      const res = await apiCall(userId, { page: nextPage, limit: 20 });
      if (res?.success === false) {
        toast.error(res?.error || 'Failed to load list');
        setItems([]);
        setTotalPages(1);
        setPage(1);
        return;
      }
      const norm = normalizeList(res);
      setItems(norm.list);
      setTotalPages(norm.pages);
      setPage(nextPage);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setListLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!canUseFollow || isSelf) return;
    setFollowLoading(true);
    try {
      const res = await toggleFollow(userId);
      if (res?.success === false) {
        toast.error(res?.error || 'Action failed');
        return;
      }

      const next =
        typeof res?.isFollowing === 'boolean'
          ? res.isFollowing
          : typeof res?.following === 'boolean'
            ? res.following
            : !isFollowing;

      setIsFollowing(next);
      setProfile((prev) => {
        if (!prev) return prev;
        const counts = prev.counts || prev;
        const current =
          typeof counts.followersCount === 'number' ? counts.followersCount : 0;
        const delta = next ? 1 : -1;
        const updatedCounts = {
          ...counts,
          followersCount: Math.max(0, current + delta),
        };
        return { ...prev, counts: updatedCounts };
      });
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadProfile();
    if (canUseFollow) {
      getFollowStatus(userId)
        .then((res) => {
          const following = typeof res?.following === 'boolean' ? res.following : false;
          setIsFollowing(following);
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error('Failed to load follow status', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'followers' || activeTab === 'following') {
      loadList(1);
    } else if (activeTab === 'posts') {
      loadPosts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userId]);

  const baseUser = profile?.user || profile || {};
  const counts = profile?.counts || profile || {};
  const headerName =
    baseUser.companyName || baseUser.fullName || baseUser.name || 'User';
  const headerRole = baseUser.role || '';
  const headerImage = baseUser.profileImage || baseUser.profilePhoto || '';
  const headerEmail = baseUser.email || '';
  const headerState = baseUser.state || '';
  const hasPaidPlan =
    profile?.plan?.isPaid === true ||
    baseUser.plan?.isPaid === true ||
    baseUser.hasPaidPlan === true ||
    baseUser.isPaid === true;

  return (
    <div className="user-public-page">
      <h1>User</h1>
      <p className="section-desc">Followers, following, posts count, and follow/unfollow.</p>

      {profileLoading ? (
        <div className="page-loading">
          <div className="spinner" />
          <p>Loading user...</p>
        </div>
      ) : (
        <UserStatsCard
          userId={userId}
          name={headerName}
          role={headerRole}
          profileImage={headerImage}
          followersCount={counts.followersCount}
          followingCount={counts.followingCount}
          postsCount={counts.postsCount}
          isVerified={hasPaidPlan}
          showFollowButton={canUseFollow && !isSelf}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onToggleFollow={handleToggleFollow}
        />
      )}

      <div className="user-public-tabs">
        <button
          type="button"
          className={`user-public-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={`user-public-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          type="button"
          className={`user-public-tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
          disabled={!canUseFollow}
          title={!canUseFollow ? 'Login required' : ''}
        >
          Followers
        </button>
        <button
          type="button"
          className={`user-public-tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
          disabled={!canUseFollow}
          title={!canUseFollow ? 'Login required' : ''}
        >
          Following
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="user-public-panel">
          <div className="user-public-kv">
            <div className="kv">
              <div className="k">Name</div>
              <div className="v">{headerName}</div>
            </div>
            <div className="kv">
              <div className="k">Role</div>
              <div className="v">{headerRole || '—'}</div>
            </div>
            {headerEmail && (
              <div className="kv">
                <div className="k">Email</div>
                <div className="v">{headerEmail}</div>
              </div>
            )}
            {headerState && (
              <div className="kv">
                <div className="k">State</div>
                <div className="v">{headerState}</div>
              </div>
            )}
          </div>
          <div className="user-public-hint">
            Tip: Click any author name/avatar in posts to open this page.
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="user-public-panel">
          {postsLoading ? (
            <div className="page-loading">
              <div className="spinner" />
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="user-public-hint">No posts from this user yet.</div>
          ) : (
            <div className="dashboard-cards posts-feed-list">
              {posts.map((p) => (
                <PostCard
                  key={p.id || p._id}
                  post={{
                    id: p.id || p._id,
                    author: p.author,
                    imageUrl: p.imageUrl || p.image,
                    description: p.description ?? p.text,
                    previewlink: p.previewlink || p.linkPreview,
                    likesCount: p.likesCount ?? 0,
                    commentsCount: p.commentsCount ?? 0,
                    shareCount: p.shareCount ?? 0,
                    likedByMe: p.likedByMe ?? false,
                    savedByMe: p.savedByMe ?? false,
                    createdAt: p.createdAt,
                  }}
                />
              ))}
            </div>
          )}

          {postsPages > 1 && (
            <div className="user-list-pagination">
              <button
                type="button"
                className="profile-btn secondary"
                disabled={postsPage <= 1}
                onClick={() => loadPosts(postsPage - 1)}
              >
                Prev
              </button>
              <div className="user-list-page">
                Page {postsPage} / {postsPages}
              </div>
              <button
                type="button"
                className="profile-btn secondary"
                disabled={postsPage >= postsPages}
                onClick={() => loadPosts(postsPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'followers' || activeTab === 'following') && (
        <div className="user-public-panel">
          {!canUseFollow ? (
            <div className="user-public-hint">Please login to view followers/following lists.</div>
          ) : listLoading ? (
            <div className="page-loading">
              <div className="spinner" />
              <p>Loading list...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="user-public-hint">No users found.</div>
          ) : (
            <div className="user-list">
              {items.map((u) => {
                const id = getId(u);
                const name = getName(u);
                const role = getRole(u);
                const img = getImage(u);
                return (
                  <Link key={id || name} to={id ? `/users/${id}` : '#'} className="user-row">
                    <div className="user-row-avatar">
                      {img ? <img src={img} alt={name} /> : <div className="user-row-avatar-fallback" />}
                    </div>
                    <div className="user-row-main">
                      <div className="user-row-name">{name}</div>
                      <div className="user-row-meta">{role || 'USER'}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {canUseFollow && totalPages > 1 && (
            <div className="user-list-pagination">
              <button
                type="button"
                className="profile-btn secondary"
                disabled={page <= 1}
                onClick={() => loadList(page - 1)}
              >
                Prev
              </button>
              <div className="user-list-page">
                Page {page} / {totalPages}
              </div>
              <button
                type="button"
                className="profile-btn secondary"
                disabled={page >= totalPages}
                onClick={() => loadList(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

