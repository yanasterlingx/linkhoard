import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bookmarks');
      setBookmarks(response.data.data || response.data);
    } catch (error) {
      setError('Failed to fetch bookmarks');
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkSaved = (bookmark) => {
    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(bookmarks.map(b => 
        b.id === bookmark.id ? bookmark : b
      ));
      setEditingBookmark(null);
    } else {
      // Add new bookmark
      setBookmarks([bookmark, ...bookmarks]);
    }
    setShowForm(false);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    try {
      await axios.delete(`/bookmarks/${bookmarkId}`);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      setError('Failed to delete bookmark');
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBookmark(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Bookmarks</h1>
          <p>Welcome back, {user?.name}! Manage your personal bookmark collection.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="add-bookmark-button"
          disabled={showForm}
        >
          + Add Bookmark
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <BookmarkForm 
            bookmark={editingBookmark}
            onSave={handleBookmarkSaved}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="bookmarks-section">
        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No bookmarks yet</h3>
            <p>Start building your collection by adding your first bookmark!</p>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="empty-state-button"
              >
                Add Your First Bookmark
              </button>
            )}
          </div>
        ) : (
          <BookmarkList 
            bookmarks={bookmarks}
            onEdit={handleEditBookmark}
            onDelete={handleDeleteBookmark}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;