import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost, getFeed, getPostShares } from '../../api/posts';
import '../../pages/Dashboard/Dashboard.css';

export default function CompanyPosts() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    text: '',
    url: '',
    title: '',
    description: '',
    image: '',
  });
  const [creating, setCreating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSharesPost, setActiveSharesPost] = useState(null);
  const [shares, setShares] = useState([]);
  const [sharesLoading, setSharesLoading] = useState(false);

  const isCompany = user?.role === 'COMPANY';

  const loadCompanyPosts = async () => {
    setLoading(true);
    try {
      // Use feed and filter client-side for this company author
      const res = await getFeed({ page: 1, limit: 20 });
      const list = res?.data?.data || res?.data || [];
      const filtered = list.filter(
        (p) => p.author && p.author.role === 'COMPANY' && p.author.email === user?.email
      );
      setPosts(filtered);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load company posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCompany) {
      loadCompanyPosts();
    } else {
      setLoading(false);
    }
  }, [isCompany]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.text.trim() && !form.url.trim()) {
      return;
    }
    setCreating(true);
    try {
      const payload = {
        text: form.text.trim() || undefined,
        linkPreview: form.url
          ? {
              url: form.url.trim(),
              title: form.title.trim() || undefined,
              description: form.description.trim() || undefined,
              image: form.image.trim() || undefined,
            }
          : undefined,
      };
      const res = await createPost(payload);
      const created = res?.data?.data || res?.data;
      if (created) {
        setPosts((prev) => [created, ...prev]);
        setForm({
          text: '',
          url: '',
          title: '',
          description: '',
          image: '',
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create post', err);
    } finally {
      setCreating(false);
    }
  };

  const openShares = async (postId) => {
    if (activeSharesPost === postId) {
      // toggle off
      setActiveSharesPost(null);
      setShares([]);
      return;
    }

    setActiveSharesPost(postId);
    setShares([]);
    setSharesLoading(true);
    try {
      const res = await getPostShares(postId);
      const list = res?.data?.data || res?.data || [];
      setShares(list);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load shares', err);
    } finally {
      setSharesLoading(false);
    }
  };

  if (!isCompany) {
    return (
      <div className="dashboard-page">
        <h1>Company Posts</h1>
        <p className="dashboard-subtitle">
          This page is only for recruiter / company accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-row">
        <div>
          <h1>Company Posts</h1>
          <p className="dashboard-subtitle">
            Share hiring updates, events, and resources with Telugu Info students. Track likes,
            comments, and who is sharing your posts.
          </p>
        </div>
        <div className="dashboard-header-meta">
          <span className="dashboard-badge">
            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
          </span>
        </div>
      </div>

      {/* Create post panel */}
      <div className="dashboard-card company-posts-create">
        <div className="company-posts-create-header">
          <h2>Create a post</h2>
          <p>
            Add a short description and optional link preview. Students will see this in their
            Company Posts feed.
          </p>
        </div>
        <form className="company-posts-form" onSubmit={handleCreate}>
          <div className="company-posts-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Example: We are hiring for a Node.js developer role in Hyderabad..."
            />
          </div>
          <div className="company-posts-link-grid">
            <div className="company-posts-field">
              <label>Link URL (optional)</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://example.com/jobs/node-developer"
              />
            </div>
            <div className="company-posts-field">
              <label>Link title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Node.js Developer - Hyderabad"
              />
            </div>
            <div className="company-posts-field">
              <label>Link description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Experience: 1-3 years, Location: Hyderabad, TS"
              />
            </div>
            <div className="company-posts-field">
              <label>Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://example.com/assets/job-banner.png"
              />
            </div>
          </div>
          <div className="company-posts-actions">
            <button
              type="submit"
              className="dashboard-refresh-button"
              disabled={creating}
            >
              {creating ? 'Posting...' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts list */}
      {loading && (
        <div className="dashboard-card">
          <p>Loading your posts...</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="dashboard-card">
          <p>
            You have not posted anything yet. Share your first update to reach Telugu Info
            students.
          </p>
        </div>
      )}

      <div className="dashboard-cards posts-feed-list company-posts-list">
        {posts.map((post) => {
          const link = post.linkPreview || post.previewlink || {};
          const createdAt = post.createdAt ? new Date(post.createdAt) : null;

          return (
            <div key={post._id} className="dashboard-card posts-feed-card company-post-card">
              <div className="company-post-card-header">
                <div className="company-post-card-meta">
                  <div className="company-post-card-title">
                    {post.text
                      ? post.text.length > 80
                        ? `${post.text.slice(0, 80)}…`
                        : post.text
                      : 'Company post'}
                  </div>
                  {createdAt && (
                    <div className="company-post-card-date">
                      Posted on {createdAt.toLocaleDateString()}{' '}
                      {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                <div className="company-post-card-stats">
                  <span>{post.likesCount || 0} likes</span>
                  <span>{post.commentsCount || 0} comments</span>
                  <span>{post.shareCount || 0} shares</span>
                </div>
              </div>

              {post.text && (
                <p className="posts-feed-text company-post-card-text">
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

              <div className="company-post-card-footer">
                <button
                  type="button"
                  className="posts-feed-action-btn"
                  onClick={() => openShares(post._id)}
                >
                  {activeSharesPost === post._id ? 'Hide share tracking' : 'View share tracking'}
                </button>
              </div>

              {activeSharesPost === post._id && (
                <div className="posts-feed-shares">
                  <h3 className="company-post-shares-title">Share tracking</h3>
                  {sharesLoading ? (
                    <p>Loading share tracking...</p>
                  ) : shares.length === 0 ? (
                    <p>No shares recorded yet for this post.</p>
                  ) : (
                    <ul className="posts-feed-shares-list">
                      {shares.map((s, index) => {
                        const u = s.user || {};
                        const sharedAt = s.createdAt ? new Date(s.createdAt) : null;
                        return (
                          <li key={s._id || index} className="posts-feed-share-item">
                            <div className="posts-feed-comment-avatar">
                              {(u.name || 'U').toString().trim().slice(0, 1).toUpperCase()}
                            </div>
                            <div className="posts-feed-comment-body">
                              <div className="posts-feed-comment-author">
                                {u.name || 'User'}
                              </div>
                              <div className="posts-feed-comment-text">
                                {sharedAt
                                  ? `Shared on ${sharedAt.toLocaleDateString()} ${sharedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                  : 'Shared'}
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
    </div>
  );
}

