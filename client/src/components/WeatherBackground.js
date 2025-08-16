import React from 'react';
import './WeatherBackground.css';

const WeatherBackground = ({ condition }) => {
  return (
    <div className={`weather-background ${condition}`}>
      {condition === 'rainy' && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random() * 1.5}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                height: `${20 + Math.random() * 30}px`,
                opacity: 0.7 + Math.random() * 0.3
              }}
            />
          ))}
        </>
      )}

      {condition === 'snowy' && (
        <>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${5 + Math.random() * 5}px`,
                height: `${5 + Math.random() * 5}px`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default WeatherBackground;