import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFeed,
  toggleLike,
  toggleSave,
  addComment,
  getComments,
  sharePost,
  createPost,
  updatePost,
  deletePost,
  getPostShares,
} from '../api/posts';
import PostCard from '../components/PostCard';
import './Dashboard/Dashboard.css';
import '../pages/Company/CompanyPosts.css';

export default function PostsFeed({
  initialTab = 'company',
  onlyTab = null, // 'student' | 'company' | null
  pageTitle = 'Posts Feed',
  subtitle = 'Discover posts from students and companies. Like, save, comment and share opportunities.',
  showCreate = true,
} = {}) {
  const { user } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [feedTab, setFeedTab] = useState(onlyTab || initialTab);
  
  // Separate posts by role
  const userPosts = allPosts.filter((p) => p.author?.role === 'USER');
  const companyPosts = allPosts.filter((p) => p.author?.role === 'COMPANY');
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [shareText, setShareText] = useState('');
  const [sharingPostId, setSharingPostId] = useState(null);
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [userCreateForm, setUserCreateForm] = useState({
    text: '',
    imageUrl: '',
    url: '',
    title: '',
    description: '',
    image: '',
  });
  const [companyCreateForm, setCompanyCreateForm] = useState({
    text: '',
    imageUrl: '',
    url: '',
    title: '',
    description: '',
    image: '',
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
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
  const [activeSharesPost, setActiveSharesPost] = useState(null);
  const [shares, setShares] = useState([]);
  const [sharesLoading, setSharesLoading] = useState(false);

  const loadFeed = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await getFeed({ page: targetPage, limit: 50 });
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.posts)
              ? res.posts
              : [];
      setAllPosts(list);
      const meta = res;
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

  useEffect(() => {
    if (onlyTab) setFeedTab(onlyTab);
  }, [onlyTab]);

  const handleUserCreateChange = (field, value) => {
    setUserCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyCreateChange = (field, value) => {
    setCompanyCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();
    const hasText = !!userCreateForm.text.trim();
    const hasImage = !!userCreateForm.imageUrl.trim();
    const hasLink = !!userCreateForm.url.trim();
    if (!hasText && !hasImage && !hasLink) return;
    setCreatingUser(true);
    try {
      const payload = {
        text: userCreateForm.text.trim() || undefined,
        imageUrl: userCreateForm.imageUrl.trim() || undefined,
        linkPreview: userCreateForm.url
          ? {
              url: userCreateForm.url.trim(),
              title: userCreateForm.title.trim() || undefined,
              description: userCreateForm.description.trim() || undefined,
              image: userCreateForm.image.trim() || undefined,
            }
          : undefined,
      };
      const res = await createPost(payload);
      const created = res?.data?.data ?? res?.data ?? res;
      if (created) {
        setAllPosts((prev) => [created, ...prev]);
        setUserCreateForm({
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
      setCreatingUser(false);
    }
  };

  const handleCompanyCreate = async (e) => {
    e.preventDefault();
    const hasText = !!companyCreateForm.text.trim();
    const hasImage = !!companyCreateForm.imageUrl.trim();
    const hasLink = !!companyCreateForm.url.trim();
    if (!hasText && !hasImage && !hasLink) return;
    setCreatingCompany(true);
    try {
      const payload = {
        text: companyCreateForm.text.trim() || undefined,
        imageUrl: companyCreateForm.imageUrl.trim() || undefined,
        linkPreview: companyCreateForm.url
          ? {
              url: companyCreateForm.url.trim(),
              title: companyCreateForm.title.trim() || undefined,
              description: companyCreateForm.description.trim() || undefined,
              image: companyCreateForm.image.trim() || undefined,
            }
          : undefined,
      };
      const res = await createPost(payload);
      const created = res?.data?.data ?? res?.data ?? res;
      if (created) {
        setAllPosts((prev) => [created, ...prev]);
        setCompanyCreateForm({
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
      setCreatingCompany(false);
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
        setAllPosts((prev) =>
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
      setAllPosts((prev) => prev.filter((p) => getPostId(p) !== postId));
      if (activeSharesPost === postId) {
        setActiveSharesPost(null);
        setShares([]);
      }
      if (activeCommentsPost === postId) {
        setActiveCommentsPost(null);
        setComments([]);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete post', err);
    } finally {
      setDeletingPostId(null);
      setMenuOpenPostId(null);
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

  const handleToggleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      const liked = res?.data?.liked;
      const likesCount = res?.data?.likesCount;
      setAllPosts((prev) =>
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
      setAllPosts((prev) =>
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
        setAllPosts((prev) =>
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
        setAllPosts((prev) =>
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

  const isOwnPost = (post) => {
    if (!user || !post.author) return false;
    return post.author.email === user.email || post.author.id === user.id || post.author._id === user.id;
  };

  const renderPostCard = (post) => {
    const postId = getPostId(post);
    const ownPost = isOwnPost(post);
    return (
      <div key={postId}>
        <PostCard
          post={normalizePostForCard(post)}
          onLike={user ? () => handleToggleLike(postId) : undefined}
          onComment={user ? () => openComments(postId) : undefined}
          onShare={user && user.role === 'USER' ? () => setActiveSharePostId(postId) : undefined}
          onSave={user && user.role === 'USER' ? () => handleToggleSave(postId) : undefined}
          onAuthorClick={undefined}
          onEdit={ownPost ? () => openEdit(post) : undefined}
          onDelete={ownPost ? () => handleDelete(postId) : undefined}
          onViewShares={ownPost ? () => openShares(postId) : undefined}
          menuOpen={menuOpenPostId === postId}
          onMenuToggle={ownPost ? () => setMenuOpenPostId(menuOpenPostId === postId ? null : postId) : undefined}
          isDeleting={deletingPostId === postId}
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

        {/* Edit form for own posts */}
        {ownPost && editingPostId === postId && (
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

        {/* Share tracking for own posts */}
        {ownPost && activeSharesPost === postId && (
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
  };

  return (
    <div className="dashboard-page">
      <h1>{pageTitle}</h1>
      <p className="dashboard-subtitle">{subtitle}</p>

      {loading && (
        <div className="dashboard-card">
          <p>Loading feed...</p>
        </div>
      )}

      {onlyTab == null && (
        <div className="posts-feed-toggle">
          <button
            type="button"
            className={`posts-feed-toggle-btn ${feedTab === 'student' ? 'active' : ''}`}
            onClick={() => setFeedTab('student')}
          >
            Student Posts <span className="posts-feed-toggle-count">{userPosts.length}</span>
          </button>
          <button
            type="button"
            className={`posts-feed-toggle-btn ${feedTab === 'company' ? 'active' : ''}`}
            onClick={() => setFeedTab('company')}
          >
            Company Posts <span className="posts-feed-toggle-count">{companyPosts.length}</span>
          </button>
        </div>
      )}

      {(onlyTab === 'student' || (onlyTab == null && feedTab === 'student')) && (
        <div className="posts-feed-section">
          <h2 className="dashboard-section-title">Student Posts</h2>
          {showCreate && user && user.role === 'USER' && (
            <div className="dashboard-card company-posts-create" style={{ marginBottom: '1.5rem' }}>
              <div className="company-posts-create-header">
                <h3>Create a student post</h3>
                <p>Share updates, opportunities, or resources with the Telugu Info community.</p>
              </div>
              <form className="company-posts-form" onSubmit={handleUserCreate}>
                <div className="company-posts-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={userCreateForm.text}
                    onChange={(e) => handleUserCreateChange('text', e.target.value)}
                    placeholder="What's on your mind?"
                  />
                </div>
                <div className="company-posts-field">
                  <label>Main image URL (optional)</label>
                  <input
                    type="url"
                    value={userCreateForm.imageUrl}
                    onChange={(e) => handleUserCreateChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="company-posts-link-grid">
                  <div className="company-posts-field">
                    <label>Link URL (optional)</label>
                    <input
                      type="url"
                      value={userCreateForm.url}
                      onChange={(e) => handleUserCreateChange('url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link title</label>
                    <input
                      type="text"
                      value={userCreateForm.title}
                      onChange={(e) => handleUserCreateChange('title', e.target.value)}
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link description</label>
                    <input
                      type="text"
                      value={userCreateForm.description}
                      onChange={(e) => handleUserCreateChange('description', e.target.value)}
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link image URL</label>
                    <input
                      type="url"
                      value={userCreateForm.image}
                      onChange={(e) => handleUserCreateChange('image', e.target.value)}
                    />
                  </div>
                </div>
                <div className="company-posts-actions">
                  <button
                    type="submit"
                    className="dashboard-refresh-button"
                    disabled={creatingUser}
                  >
                    {creatingUser ? 'Posting...' : 'Publish post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!loading && userPosts.length === 0 ? (
            <div className="dashboard-card">
              <p>
                No student posts yet.{' '}
                {user?.role === 'USER'
                  ? 'Create your first post!'
                  : 'Students can share updates here.'}
              </p>
            </div>
          ) : (
            <div className="dashboard-cards posts-feed-list">
              {userPosts.map(renderPostCard)}
            </div>
          )}
        </div>
      )}

      {(onlyTab === 'company' || (onlyTab == null && feedTab === 'company')) && (
        <div className="posts-feed-section">
          <h2 className="dashboard-section-title">Company Posts</h2>
          {showCreate && user && user.role === 'COMPANY' && (
            <div className="dashboard-card company-posts-create" style={{ marginBottom: '1.5rem' }}>
              <div className="company-posts-create-header">
                <h3>Create a company post</h3>
                <p>Share hiring updates, events, and resources with Telugu Info students.</p>
              </div>
              <form className="company-posts-form" onSubmit={handleCompanyCreate}>
                <div className="company-posts-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={companyCreateForm.text}
                    onChange={(e) => handleCompanyCreateChange('text', e.target.value)}
                    placeholder="Example: We are hiring for a Node.js developer role in Hyderabad..."
                  />
                </div>
                <div className="company-posts-field">
                  <label>Main image URL (optional)</label>
                  <input
                    type="url"
                    value={companyCreateForm.imageUrl}
                    onChange={(e) => handleCompanyCreateChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="company-posts-link-grid">
                  <div className="company-posts-field">
                    <label>Link URL (optional)</label>
                    <input
                      type="url"
                      value={companyCreateForm.url}
                      onChange={(e) => handleCompanyCreateChange('url', e.target.value)}
                      placeholder="https://example.com/jobs/node-developer"
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link title</label>
                    <input
                      type="text"
                      value={companyCreateForm.title}
                      onChange={(e) => handleCompanyCreateChange('title', e.target.value)}
                      placeholder="Node.js Developer - Hyderabad"
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link description</label>
                    <input
                      type="text"
                      value={companyCreateForm.description}
                      onChange={(e) => handleCompanyCreateChange('description', e.target.value)}
                      placeholder="Experience: 1-3 years, Location: Hyderabad, TS"
                    />
                  </div>
                  <div className="company-posts-field">
                    <label>Link image URL</label>
                    <input
                      type="url"
                      value={companyCreateForm.image}
                      onChange={(e) => handleCompanyCreateChange('image', e.target.value)}
                      placeholder="https://example.com/assets/job-banner.png"
                    />
                  </div>
                </div>
                <div className="company-posts-actions">
                  <button
                    type="submit"
                    className="dashboard-refresh-button"
                    disabled={creatingCompany}
                  >
                    {creatingCompany ? 'Posting...' : 'Publish post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!loading && companyPosts.length === 0 ? (
            <div className="dashboard-card">
              <p>
                No company posts yet.{' '}
                {user?.role === 'COMPANY'
                  ? 'Create your first post!'
                  : 'Companies can share updates here.'}
              </p>
            </div>
          ) : (
            <div className="dashboard-cards posts-feed-list">
              {companyPosts.map(renderPostCard)}
            </div>
          )}
        </div>
      )}

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

