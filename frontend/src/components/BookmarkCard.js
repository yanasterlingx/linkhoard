import React from 'react';
import './BookmarkCard.css';

const BookmarkCard = ({ bookmark, onEdit, onDelete }) => {
  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Invalid URL';
    }
  };

  return (
    <div className="bookmark-card">
      <div className="bookmark-header">
        <div className="bookmark-favicon">
          <img 
            src={`https://www.google.com/s2/favicons?domain=${getDomainFromUrl(bookmark.url)}&sz=32`}
            alt=""
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="bookmark-icon">🔗</span>
        </div>
        <div className="bookmark-actions">
          <button
            onClick={() => onEdit(bookmark)}
            className="action-button edit-button"
            title="Edit bookmark"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(bookmark.id)}
            className="action-button delete-button"
            title="Delete bookmark"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="bookmark-content" onClick={handleVisit}>
        <h3 className="bookmark-title">{bookmark.title}</h3>
        <p className="bookmark-domain">{getDomainFromUrl(bookmark.url)}</p>
        {bookmark.description && (
          <p className="bookmark-description">{bookmark.description}</p>
        )}
      </div>

      <div className="bookmark-footer">
        <span className="bookmark-date">
          Added {formatDate(bookmark.created_at)}
        </span>
        <button
          onClick={handleVisit}
          className="visit-button"
        >
          Visit →
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;