import React, { useState } from 'react';
import { FiSearch, FiNavigation } from 'react-icons/fi';
import './LocationInput.css';

const LocationInput = ({ onSearch, onUseCurrentLocation }) => {
  const [inputLocation, setInputLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputLocation.trim()) {
      onSearch(inputLocation);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <div className="search-container">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Enter city, zip code, or coordinates"
          className="location-input"
        />
        <button type="submit" className="search-button">
          <FiSearch className="search-icon" />
        </button>
      </div>
      <button 
        type="button" 
        onClick={onUseCurrentLocation}
        className="current-location-button"
      >
        <FiNavigation className="location-icon" />
        Use My Location
      </button>
    </form>
  );
};

export default LocationInput;