import React, { useState } from 'react';
import './ManualQueryForm.css';

const ManualQueryForm = ({ onCreateQuery, loading }) => {
  const [formData, setFormData] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validate location
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Validate dates
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start > end) {
        newErrors.dateRange = 'Start date must be before end date';
      }
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      
      // Limit to reasonable range (e.g., max 30 days)
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
      onCreateQuery({
        location: formData.location.trim(),
        dateRange: {
          start: new Date(formData.startDate),
          end: new Date(formData.endDate)
        }
      });
      
      // Reset form
      setFormData({ location: '', startDate: '', endDate: '' });
      setErrors({});
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="manual-query-form">
      <h3>Create Weather Query</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter city, zip code, or coordinates"
            className={errors.location ? 'error' : ''}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-text">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <span className="error-text">{errors.endDate}</span>}
          </div>
        </div>

        {errors.dateRange && <span className="error-text">{errors.dateRange}</span>}

        <button type="submit" disabled={loading} className="create-query-button">
          {loading ? 'Creating...' : 'Create Weather Query'}
        </button>
      </form>
    </div>
  );
};

export default ManualQueryForm;