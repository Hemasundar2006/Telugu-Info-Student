import React from 'react';
import { Link } from 'react-router-dom';
import { FiMoreVertical, FiEdit2, FiTrash2, FiBookmark } from 'react-icons/fi';

const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onAuthorClick,
  onEdit,
  onDelete,
  onViewShares,
  menuOpen,
  onMenuToggle,
  isDeleting,
}) => {
  const {
    id,
    author,
    imageUrl,
    description,
    previewlink,
    likesCount,
    commentsCount,
    shareCount,
    likedByMe,
    savedByMe,
    createdAt,
  } = post;

  const authorId = author?._id || author?.id;
  const authorHasPaidPlan =
    author?.plan?.isPaid === true ||
    author?.hasPaidPlan === true ||
    author?.isPaid === true;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <article className="post-card" style={styles.card}>
      {/* Author: profile image + name + menu */}
      <header style={styles.header}>
        {authorId && !onAuthorClick ? (
          <Link to={`/users/${authorId}`} style={styles.authorRow}>
            <div style={styles.avatarWrapper}>
              {author?.profileImage ? (
                <img
                  src={author.profileImage}
                  alt={author.name}
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {(author?.name || author?.companyName || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div style={styles.authorInfo}>
              <span style={styles.authorName}>
                {(author?.companyName || author?.name) ?? 'Unknown'}
                {authorHasPaidPlan && (
                  <span style={styles.verifiedTick} title="Verified company">
                    <img src="/verified.png" alt="Verified" style={styles.verifiedImg} />
                  </span>
                )}
              </span>
              {createdAt && (
                <span style={styles.date}>{formatDate(createdAt)}</span>
              )}
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onAuthorClick?.(author)}
            style={styles.authorRow}
          >
          <div style={styles.avatarWrapper}>
            {author?.profileImage ? (
              <img
                src={author.profileImage}
                alt={author.name}
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {(author?.name || author?.companyName || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.authorInfo}>
          <span style={styles.authorName}>
                {(author?.companyName || author?.name) ?? 'Unknown'}
                {authorHasPaidPlan && (
                  <span style={styles.verifiedTick} title="Verified company">
                    <img src="/verified.png" alt="Verified" style={styles.verifiedImg} />
                  </span>
                )}
              </span>
            {createdAt && (
              <span style={styles.date}>{formatDate(createdAt)}</span>
            )}
          </div>
          </button>
        )}
        {(onEdit || onDelete || onViewShares) && (
          <div style={styles.menuWrap}>
            <button
              type="button"
              aria-label="More options"
              style={styles.menuBtn}
              onClick={onMenuToggle}
              disabled={isDeleting}
            >
              <FiMoreVertical size={18} />
            </button>
            {menuOpen && (
              <>
                <div
                  style={styles.menuBackdrop}
                  aria-hidden
                  onClick={onMenuToggle}
                />
                <div style={styles.menuDropdown}>
                  {onEdit && (
                    <button
                      type="button"
                      style={styles.menuItem}
                      onClick={() => {
                        onEdit();
                        onMenuToggle();
                      }}
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                  )}
                  {onViewShares && (
                    <button
                      type="button"
                      style={styles.menuItem}
                      onClick={() => {
                        onViewShares();
                        onMenuToggle();
                      }}
                    >
                      <FiBookmark size={16} /> View shares
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      style={styles.menuItemDanger}
                      onClick={() => {
                        onDelete();
                        onMenuToggle();
                      }}
                      disabled={isDeleting}
                    >
                      <FiTrash2 size={16} /> {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {!(onEdit || onDelete || onViewShares) && (
          <button type="button" aria-label="More options" style={styles.menuBtn}>
            ⋮
          </button>
        )}
      </header>

      {/* Media image (imageUrl) */}
      {imageUrl && (
        <div style={styles.mediaWrap}>
          <img
            src={imageUrl}
            alt="Post"
            style={styles.mediaImage}
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <div style={styles.description}>{description}</div>
      )}

      {/* Optional link preview card */}
      {previewlink?.url && (
        <a
          href={previewlink.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.previewLink}
        >
          {previewlink.image && (
            <img
              src={previewlink.image}
              alt=""
              style={styles.previewImage}
            />
          )}
          <div style={styles.previewText}>
            <strong>{previewlink.title || previewlink.url}</strong>
            {previewlink.description && (
              <span style={styles.previewDesc}>{previewlink.description}</span>
            )}
          </div>
        </a>
      )}

      {/* Like, Comment, Share, Save */}
      <footer style={styles.footer}>
        <button
          type="button"
          onClick={() => onLike?.(id)}
          style={styles.actionBtn}
          aria-pressed={likedByMe}
        >
          <span style={likedByMe ? styles.iconLiked : {}}>♥</span>
          <span>{likesCount ?? 0}</span>
        </button>
        <button
          type="button"
          onClick={() => onComment?.(id)}
          style={styles.actionBtn}
        >
          <span>💬</span>
          <span>{commentsCount ?? 0}</span>
        </button>
        <button
          type="button"
          onClick={() => onShare?.(id)}
          style={styles.actionBtn}
        >
          <span>↗</span>
          <span>{shareCount ?? 0}</span>
        </button>
        <button
          type="button"
          onClick={() => onSave?.(id)}
          style={styles.actionBtn}
          aria-pressed={savedByMe}
        >
          <span style={savedByMe ? styles.iconSaved : {}}>🔖</span>
          <span>Save</span>
        </button>
        {onViewShares && (
          <button
            type="button"
            onClick={() => onViewShares()}
            style={styles.actionBtn}
            title="View share tracking"
          >
            <FiBookmark size={18} />
            <span>Tracking</span>
          </button>
        )}
      </footer>
    </article>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 600,
    color: '#666',
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  authorName: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontWeight: 600,
    fontSize: 14,
    color: '#111',
  },
  verifiedTick: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedImg: {
    width: 16,
    height: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuWrap: {
    position: 'relative',
  },
  menuBtn: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: 4,
    fontSize: 18,
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 10,
  },
  menuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    minWidth: 140,
    padding: 4,
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 20,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    fontSize: 14,
    color: '#111',
    cursor: 'pointer',
    borderRadius: 6,
    textAlign: 'left',
  },
  menuItemDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'none',
    fontSize: 14,
    color: '#dc2626',
    cursor: 'pointer',
    borderRadius: 6,
    textAlign: 'left',
  },
  mediaWrap: {
    width: 'min(640px, 100%)',
    aspectRatio: '1',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  description: {
    padding: '12px 16px',
    fontSize: 14,
    lineHeight: 1.5,
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  previewLink: {
    display: 'flex',
    margin: '0 16px 12px',
    border: '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
  },
  previewImage: {
    width: 80,
    height: 80,
    objectFit: 'cover',
  },
  previewText: {
    flex: 1,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  previewDesc: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px 12px',
    borderTop: '1px solid #eee',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '8px 12px',
    fontSize: 13,
    color: '#666',
  },
  iconLiked: { color: '#e0245e' },
  iconSaved: { color: '#0a66c2' },
};

export default PostCard;
