import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkForm.css';

const BookmarkForm = ({ bookmark, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || '',
        url: bookmark.url || '',
        description: bookmark.description || ''
      });
    }
  }, [bookmark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      let response;
      if (bookmark) {
        // Update existing bookmark
        response = await axios.put(`/bookmarks/${bookmark.id}`, formData);
      } else {
        // Create new bookmark
        response = await axios.post('/bookmarks', formData);
      }

      onSave(response.data.data || response.data);
      
      // Reset form if creating new bookmark
      if (!bookmark) {
        setFormData({
          title: '',
          url: '',
          description: ''
        });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || 'Failed to save bookmark'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookmark-form-container">
      <div className="bookmark-form-header">
        <h3>{bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}</h3>
        <button 
          type="button" 
          onClick={onCancel}
          className="form-close-button"
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bookmark-form">
        {errors.general && (
          <div className="form-error">{errors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter bookmark title"
            required
          />
          {errors.title && (
            <div className="field-error">{errors.title[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="url">URL *</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
          {errors.url && (
            <div className="field-error">{errors.url[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description..."
            rows="3"
          />
          {errors.description && (
            <div className="field-error">{errors.description[0]}</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : bookmark ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkForm;