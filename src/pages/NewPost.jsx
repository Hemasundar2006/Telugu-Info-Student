import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import './Dashboard/Dashboard.css';
import './Company/CompanyPosts.css';

export default function NewPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    text: '',
    imageUrl: '',
    url: '',
    title: '',
    description: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasText = !!form.text.trim();
    const hasImage = !!form.imageUrl.trim();
    const hasLink = !!form.url.trim();
    if (!hasText && !hasImage && !hasLink) return;
    setSubmitting(true);
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
      await createPost(payload);
      navigate('/feed');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create post', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <h1>New Post</h1>
      <p className="dashboard-subtitle">
        Create a new student post. You can add text, an image, and an optional link preview.
      </p>

      <div className="dashboard-card company-posts-create">
        <div className="company-posts-create-header">
          <h3>Create a student post</h3>
          <p>Share updates, opportunities, or resources with the Telugu Info community.</p>
        </div>
        <form className="company-posts-form" onSubmit={handleSubmit}>
          <div className="company-posts-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="What's on your mind?"
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
                placeholder="https://example.com/article"
              />
            </div>
            <div className="company-posts-field">
              <label>Link title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="company-posts-field">
              <label>Link description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="company-posts-field">
              <label>Link image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => handleChange('image', e.target.value)}
              />
            </div>
          </div>
          <div className="company-posts-actions">
            <button
              type="submit"
              className="dashboard-refresh-button"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

