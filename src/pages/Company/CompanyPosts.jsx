import { useEffect, useState } from 'react';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { createPost, getFeed, getPostShares, updatePost, deletePost } from '../../api/posts';
import '../../pages/Dashboard/Dashboard.css';
import './CompanyPosts.css';

export default function CompanyPosts() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    text: '',
    imageUrl: '',
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
  const [menuOpenPostId, setMenuOpenPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({
    text: '',
    imageUrl: '',
    url: '',
    title: '',
    description: '',
    image: '',
  });
  const [updating, setUpdating] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const isCompany = user?.role === 'COMPANY';

  const getPostId = (post) => post?.id ?? post?._id;

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
    const hasText = !!form.text.trim();
    const hasImage = !!form.imageUrl.trim();
    const hasLink = !!form.url.trim();
    if (!hasText && !hasImage && !hasLink) {
      return;
    }
    setCreating(true);
    try {
      const payload = {
        text: form.text.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
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
          imageUrl: '',
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

  const openEdit = (post) => {
    const link = post.linkPreview || post.previewlink || {};
    setEditForm({
      text: post.text ?? post.description ?? '',
      imageUrl: post.imageUrl ?? post.image ?? '',
      url: link?.url ?? '',
      title: link?.title ?? '',
      description: link?.description ?? '',
      image: link?.image ?? '',
    });
    setEditingPostId(getPostId(post));
    setMenuOpenPostId(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPostId) return;
    const hasText = !!editForm.text.trim();
    const hasImage = !!editForm.imageUrl.trim();
    const hasLink = !!editForm.url.trim();
    if (!hasText && !hasImage && !hasLink) return;
    setUpdating(true);
    try {
      const payload = {
        text: editForm.text.trim() || undefined,
        imageUrl: editForm.imageUrl.trim() || undefined,
        linkPreview: editForm.url
          ? {
              url: editForm.url.trim(),
              title: editForm.title.trim() || undefined,
              description: editForm.description.trim() || undefined,
              image: editForm.image.trim() || undefined,
            }
          : undefined,
      };
      const res = await updatePost(editingPostId, payload);
      const updated = res?.data?.data ?? res?.data ?? res;
      if (updated) {
        setPosts((prev) =>
          prev.map((p) => (getPostId(p) === editingPostId ? { ...p, ...updated } : p))
        );
      }
      setEditingPostId(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update post', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeletingPostId(postId);
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => getPostId(p) !== postId));
      if (activeSharesPost === postId) {
        setActiveSharesPost(null);
        setShares([]);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete post', err);
    } finally {
      setDeletingPostId(null);
      setMenuOpenPostId(null);
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
          <div className="company-posts-field">
            <label>Main image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/photo.jpg"
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

      <div className="company-posts-list">
        {posts.map((post) => {
          const postId = getPostId(post);
          const link = post.linkPreview || post.previewlink || {};
          const createdAt = post.createdAt ? new Date(post.createdAt) : null;
          const authorName =
            post.author?.companyName ||
            post.author?.name ||
            user?.name ||
            user?.email?.split('@')[0] ||
            'Company';
          const initial = (authorName || 'C').toString().trim().slice(0, 1).toUpperCase();
          const isMenuOpen = menuOpenPostId === postId;
          const isEditing = editingPostId === postId;
          const isDeleting = deletingPostId === postId;

          return (
            <article key={postId} className="post-frame">
              {/* Header: avatar, name, menu */}
              <div className="post-frame-header">
                <div className="post-frame-avatar">{initial}</div>
                <div className="post-frame-author">
                  <div className="post-frame-author-name">{authorName}</div>
                  {createdAt && (
                    <div className="post-frame-author-meta">
                      {createdAt.toLocaleDateString()} · {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                <div className="post-frame-menu-wrap">
                  <button
                    type="button"
                    className="post-frame-menu"
                    aria-label="More options"
                    onClick={() => setMenuOpenPostId(isMenuOpen ? null : postId)}
                    disabled={isDeleting}
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {isMenuOpen && (
                    <>
                      <div
                        className="post-frame-menu-backdrop"
                        aria-hidden
                        onClick={() => setMenuOpenPostId(null)}
                      />
                      <div className="post-frame-menu-dropdown">
                        <button
                          type="button"
                          className="post-frame-menu-item"
                          onClick={() => openEdit(post)}
                        >
                          <FiEdit2 size={16} /> Edit
                        </button>
                        <button
                          type="button"
                          className="post-frame-menu-item post-frame-menu-item-danger"
                          onClick={() => handleDelete(postId)}
                          disabled={isDeleting}
                        >
                          <FiTrash2 size={16} /> {isDeleting ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Media: main post image (imageUrl) */}
              {(post.imageUrl || post.image) && (
                <div className="post-frame-media">
                  <img
                    src={post.imageUrl || post.image}
                    alt="Post"
                    className="post-frame-media-image"
                  />
                </div>
              )}

              {/* Content: light grey area + description + link preview */}
              <div className="post-frame-content">
                {createdAt && (
                  <div className="post-frame-date">
                    {createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </div>
                )}
                {(post.description ?? post.text) && (
                  <p className="post-frame-text">{post.description ?? post.text}</p>
                )}
                {link?.url && (
                  <a
                    href={link.url}
                    className="post-frame-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.image && (
                      <img
                        src={link.image}
                        alt={link.title || ''}
                        className="post-frame-link-image"
                      />
                    )}
                    <div className="post-frame-link-body">
                      <h3 className="post-frame-link-title">{link.title || link.url}</h3>
                      {link.description && (
                        <p className="post-frame-link-desc">{link.description}</p>
                      )}
                      <p className="post-frame-link-url">{link.url}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Footer: like, comment, share, bookmark + view share tracking */}
              <div className="post-frame-footer">
                <span className="post-frame-action" title="Likes">
                  <FiHeart size={20} /> {post.likesCount ?? 0}
                </span>
                <span className="post-frame-action" title="Comments">
                  <FiMessageCircle size={20} /> {post.commentsCount ?? 0}
                </span>
                <span className="post-frame-action" title="Shares">
                  <FiSend size={20} /> {post.shareCount ?? 0}
                </span>
                <span className="post-frame-footer-spacer" />
                <button
                  type="button"
                  className="post-frame-action"
                  onClick={() => openShares(postId)}
                  title={activeSharesPost === postId ? 'Hide share tracking' : 'View share tracking'}
                >
                  <FiBookmark size={20} />
                  {activeSharesPost === postId ? 'Hide tracking' : 'View tracking'}
                </button>
              </div>

              {/* Share tracking expandable */}
              {activeSharesPost === postId && (
                <div className="post-frame-shares">
                  <h3 className="post-frame-shares-title">Share tracking</h3>
                  {sharesLoading ? (
                    <p>Loading share tracking...</p>
                  ) : shares.length === 0 ? (
                    <p>No shares recorded yet for this post.</p>
                  ) : (
                    <ul className="post-frame-shares-list">
                      {shares.map((s, index) => {
                        const u = s.user || {};
                        const sharedAt = s.createdAt ? new Date(s.createdAt) : null;
                        return (
                          <li key={s._id || index} className="post-frame-share-item">
                            <div className="post-frame-share-avatar">
                              {(u.name || 'U').toString().trim().slice(0, 1).toUpperCase()}
                            </div>
                            <div className="post-frame-share-body">
                              <div className="post-frame-share-name">{u.name || 'User'}</div>
                              <div className="post-frame-share-date">
                                {sharedAt
                                  ? sharedAt.toLocaleDateString() + ' ' + sharedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

              {/* Edit form (inline) */}
              {isEditing && (
                <div className="post-frame-edit">
                  <form className="company-posts-form" onSubmit={handleEditSubmit}>
                    <div className="company-posts-field">
                      <label>Description</label>
                      <textarea
                        rows={3}
                        value={editForm.text}
                        onChange={(e) => handleEditChange('text', e.target.value)}
                        placeholder="Description..."
                      />
                    </div>
                    <div className="company-posts-field">
                      <label>Main image URL</label>
                      <input
                        type="url"
                        value={editForm.imageUrl}
                        onChange={(e) => handleEditChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="company-posts-link-grid">
                      <div className="company-posts-field">
                        <label>Link URL</label>
                        <input
                          type="url"
                          value={editForm.url}
                          onChange={(e) => handleEditChange('url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="company-posts-field">
                        <label>Link title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => handleEditChange('title', e.target.value)}
                        />
                      </div>
                      <div className="company-posts-field">
                        <label>Link description</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => handleEditChange('description', e.target.value)}
                        />
                      </div>
                      <div className="company-posts-field">
                        <label>Link image URL</label>
                        <input
                          type="url"
                          value={editForm.image}
                          onChange={(e) => handleEditChange('image', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="company-posts-actions">
                      <button
                        type="submit"
                        className="dashboard-refresh-button"
                        disabled={updating}
                      >
                        {updating ? 'Saving…' : 'Save changes'}
                      </button>
                      <button
                        type="button"
                        className="dashboard-refresh-button post-frame-edit-cancel"
                        onClick={() => setEditingPostId(null)}
                        disabled={updating}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

