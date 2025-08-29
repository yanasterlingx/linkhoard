import React from 'react';
import BookmarkCard from './BookmarkCard';
import './BookmarkList.css';

const BookmarkList = ({ bookmarks, onEdit, onDelete }) => {
  return (
    <div className="bookmark-list">
      <div className="bookmark-grid">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;