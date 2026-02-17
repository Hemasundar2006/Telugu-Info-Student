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
          p._id === postId
            ? {
                ...p,
                likedByViewer: liked,
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
          p._id === postId
            ? {
                ...p,
                savedByViewer: saved,
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
      // Optional: allow empty share text; here we require some text
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
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to share post', err);
    } finally {
      setSharingPostId(null);
    }
  };

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
          const author = post.author || {};
          const link = post.linkPreview || post.previewlink || {};
          return (
            <div key={post._id} className="dashboard-card posts-feed-card">
              <div className="posts-feed-header">
                <div className="posts-feed-author">
                  <div className="posts-feed-avatar">
                    {(author.name || author.companyName || 'C')
                      .toString()
                      .trim()
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="posts-feed-author-name">
                      {author.companyName || author.name || 'Company'}
                    </div>
                    <div className="posts-feed-author-meta">
                      {author.email || ''}
                    </div>
                  </div>
                </div>
              </div>

              {post.text && (
                <p className="posts-feed-text">
                  {post.text}
                </p>
              )}

              {link?.url && (
                <a
                  href={link.url}
                  className="posts-feed-link-preview"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.image && (
                    <div className="posts-feed-link-image-wrap">
                      <img src={link.image} alt={link.title || ''} />
                    </div>
                  )}
                  <div className="posts-feed-link-body">
                    <div className="posts-feed-link-title">{link.title || link.url}</div>
                    {link.description && (
                      <div className="posts-feed-link-desc">
                        {link.description}
                      </div>
                    )}
                    <div className="posts-feed-link-url">{link.url}</div>
                  </div>
                </a>
              )}

              <div className="posts-feed-stats">
                <span>{post.likesCount || 0} likes</span>
                <span>{post.commentsCount || 0} comments</span>
                <span>{post.shareCount || 0} shares</span>
              </div>

              <div className="posts-feed-actions">
                <button
                  type="button"
                  className={`posts-feed-action-btn ${post.likedByViewer ? 'active' : ''}`}
                  onClick={() => handleToggleLike(post._id)}
                  disabled={!user}
                >
                  {post.likedByViewer ? 'Unlike' : 'Like'}
                </button>
                <button
                  type="button"
                  className={`posts-feed-action-btn ${post.savedByViewer ? 'active' : ''}`}
                  onClick={() => handleToggleSave(post._id)}
                  disabled={!user || user.role !== 'USER'}
                >
                  {post.savedByViewer ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  className="posts-feed-action-btn"
                  onClick={() => openComments(post._id)}
                  disabled={!user}
                >
                  Comments
                </button>
              </div>

              {user && user.role === 'USER' && (
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
                    onClick={() => handleShare(post._id)}
                    disabled={sharingPostId === post._id}
                  >
                    {sharingPostId === post._id ? 'Sharing...' : 'Share'}
                  </button>
                </div>
              )}

              {activeCommentsPost === post._id && (
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
                          <li key={c._id} className="posts-feed-comment">
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

