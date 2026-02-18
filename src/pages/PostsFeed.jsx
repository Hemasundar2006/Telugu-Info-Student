import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFeed,
  toggleLike,
  toggleSave,
  addComment,
  getComments,
  sharePost,
} from '../api/posts';
import PostCard from '../components/PostCard';
import './Dashboard/Dashboard.css';

export default function PostsFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shareText, setShareText] = useState('');
  const [sharingPostId, setSharingPostId] = useState(null);
  const [activeSharePostId, setActiveSharePostId] = useState(null);

  const loadFeed = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await getFeed({ page: targetPage, limit: 10 });
      const list = res?.data?.data || res?.data || [];
      setPosts(list);
      const meta = res?.data;
      setHasMore(
        typeof meta?.page === 'number' && typeof meta?.pages === 'number'
          ? meta.page < meta.pages
          : false
      );
      setPage(targetPage);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(1);
  }, []);

  const handleToggleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      const liked = res?.data?.liked;
      const likesCount = res?.data?.likesCount;
      setPosts((prev) =>
        prev.map((p) =>
          (p._id === postId || p.id === postId)
            ? {
                ...p,
                likedByViewer: liked,
                likedByMe: liked,
                likesCount: likesCount ?? (p.likesCount || 0) + (liked ? 1 : -1),
              }
            : p
        )
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to toggle like', err);
    }
  };

  const handleToggleSave = async (postId) => {
    try {
      const res = await toggleSave(postId);
      const saved = res?.data?.saved;
      setPosts((prev) =>
        prev.map((p) =>
          (p._id === postId || p.id === postId)
            ? {
                ...p,
                savedByViewer: saved,
                savedByMe: saved,
              }
            : p
        )
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to toggle save', err);
    }
  };

  const openComments = async (postId) => {
    setActiveCommentsPost(postId);
    setComments([]);
    setNewComment('');
    setCommentsLoading(true);
    try {
      const res = await getComments(postId, { page: 1, limit: 20 });
      const list = res?.data?.data || res?.data || [];
      setComments(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load comments', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!activeCommentsPost || !newComment.trim()) return;
    try {
      const res = await addComment(activeCommentsPost, { body: newComment.trim() });
      const created = res?.data?.data || res?.data;
      if (created) {
        setComments((prev) => [created, ...prev]);
        setPosts((prev) =>
          prev.map((p) =>
            p._id === activeCommentsPost
              ? {
                  ...p,
                  commentsCount: (p.commentsCount || 0) + 1,
                }
              : p
          )
        );
        setNewComment('');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to add comment', err);
    }
  };

  const handleShare = async (postId) => {
    if (!shareText.trim()) {
      return;
    }
    setSharingPostId(postId);
    try {
      const res = await sharePost(postId, {
        text: shareText.trim(),
      });
      if (res?.data?.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  shareCount: (p.shareCount || 0) + 1,
                  sharedByViewer: true,
                }
              : p
          )
        );
        setShareText('');
        setActiveSharePostId(null);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to share post', err);
    } finally {
      setSharingPostId(null);
    }
  };

  const getPostId = (p) => p.id ?? p._id;

  const normalizePostForCard = (p) => ({
    id: getPostId(p),
    author: p.author || {},
    imageUrl: p.imageUrl || null,
    description: p.description ?? p.text ?? '',
    previewlink: p.linkPreview || p.previewlink || null,
    likesCount: p.likesCount ?? 0,
    commentsCount: p.commentsCount ?? 0,
    shareCount: p.shareCount ?? 0,
    likedByMe: !!(p.likedByMe ?? p.likedByViewer),
    savedByMe: !!(p.savedByMe ?? p.savedByViewer),
    createdAt: p.createdAt,
  });

  return (
    <div className="dashboard-page">
      <h1>Company Posts</h1>
      <p className="dashboard-subtitle">
        Discover posts from verified companies. Like, save, comment and share opportunities.
      </p>

      {loading && (
        <div className="dashboard-card">
          <p>Loading feed...</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="dashboard-card">
          <p>No posts yet. Companies can share updates and jobs here.</p>
        </div>
      )}

      <div className="dashboard-cards posts-feed-list">
        {posts.map((post) => {
          const postId = getPostId(post);
          return (
            <div key={postId}>
            <PostCard
              post={normalizePostForCard(post)}
              onLike={user ? () => handleToggleLike(postId) : undefined}
              onComment={user ? () => openComments(postId) : undefined}
              onShare={user && user.role === 'USER' ? () => setActiveSharePostId(postId) : undefined}
              onSave={user && user.role === 'USER' ? () => handleToggleSave(postId) : undefined}
              onAuthorClick={undefined}
            />

            {/* Share input for this post when Share was clicked */}
            {user && user.role === 'USER' && activeSharePostId === postId && (
              <div className="posts-feed-share">
                <input
                  type="text"
                  placeholder="Share with your thoughts..."
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                />
                <button
                  type="button"
                  className="posts-feed-share-btn"
                  onClick={() => handleShare(postId)}
                  disabled={sharingPostId === postId}
                >
                  {sharingPostId === postId ? 'Sharing...' : 'Share'}
                </button>
                <button
                  type="button"
                  className="posts-feed-action-btn"
                  onClick={() => setActiveSharePostId(null)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Comments section when Comments was clicked */}
            {activeCommentsPost === postId && (
              <div className="posts-feed-comments">
                <div className="posts-feed-comments-input">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    disabled={commentsLoading}
                  >
                    Post
                  </button>
                </div>
                {commentsLoading ? (
                  <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  <ul className="posts-feed-comments-list">
                    {comments.map((c) => {
                      const a = c.author || c.user || {};
                      return (
                        <li key={c._id || c.id} className="posts-feed-comment">
                          <div className="posts-feed-comment-avatar">
                            {(a.name || 'U').toString().trim().slice(0, 1).toUpperCase()}
                          </div>
                          <div className="posts-feed-comment-body">
                            <div className="posts-feed-comment-author">
                              {a.name || 'User'}
                            </div>
                            <div className="posts-feed-comment-text">
                              {c.body || c.text}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            </div>
          );
        })}
      </div>

      {!loading && hasMore && (
        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => loadFeed(page + 1)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

