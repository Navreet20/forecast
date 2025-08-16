import React, { useState, useEffect } from 'react';
import './UpdateQueryModal.css';

const UpdateQueryModal = ({ query, isOpen, onClose, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (query && isOpen) {
      setFormData({
        location: query.location || '',
        startDate: query.dateRange?.start ? new Date(query.dateRange.start).toISOString().split('T')[0] : '',
        endDate: query.dateRange?.end ? new Date(query.dateRange.end).toISOString().split('T')[0] : ''
      });
    }
  }, [query, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start > end) {
        newErrors.dateRange = 'Start date must be before end date';
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        newErrors.dateRange = 'Date range cannot exceed 30 days';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(query._id, {
        location: formData.location.trim(),
        dateRange: {
          start: new Date(formData.startDate),
          end: new Date(formData.endDate)
        }
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Weather Query</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="update-location">Location:</label>
            <input
              type="text"
              id="update-location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter city, zip code, or coordinates"
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="update-startDate">Start Date:</label>
              <input
                type="date"
                id="update-startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-text">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="update-endDate">End Date:</label>
              <input
                type="date"
                id="update-endDate"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-text">{errors.endDate}</span>}
            </div>
          </div>

          {errors.dateRange && <span className="error-text">{errors.dateRange}</span>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="update-button">
              {loading ? 'Updating...' : 'Update Query'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQueryModal;