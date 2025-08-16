import React from 'react';
import WeatherIcon from './WeatherIcon';
import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { FiNavigation2 } from 'react-icons/fi';

const CurrentWeather = ({ data, unit, onUnitChange }) => {
  if (!data) return null;
    const displayTemp = Math.round(data.main.temp);
    const timezoneOffset = data.timezone || 0; 

    const formatLocalTime = (utcSeconds) => {

      const localMillis = (utcSeconds + timezoneOffset) * 1000;
      const d = new Date(localMillis);

      const hours = d.getUTCHours();
      const minutes = d.getUTCMinutes();

  // format to 12-hour with AM/PM
      const hour12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const sunrise = formatLocalTime(data.sys.sunrise);
const sunset = formatLocalTime(data.sys.sunset);

  const windDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  return (
    <div className="current-weather-card">
      <div className="weather-main">
        <div className="location-info">
          <h2>{data.name}, {data.sys.country}</h2>
          <p className="weather-description">{data.weather[0].description}</p>
        </div>
        
        <div className="temperature-section">
          <WeatherIcon condition={data.weather[0].main.toLowerCase()} size={120} />
          <div className="temperature-display">
            <span className="temp-value">{Math.round(displayTemp)}</span>
            <span className="temp-unit">
              °{unit}
              <button onClick={onUnitChange} className="unit-toggle" >
                °{unit === 'C' ? 'F' : 'C'}
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <WiHumidity className="detail-icon" />
          <div>
            <div className="detail-value">{data.main.humidity}%</div>
            <div className="detail-label">Humidity</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="wind-icon">
            <FiNavigation2 style={{ transform: `rotate(${data.wind.deg - 45}deg)` }} />
          </div>
          <div>
            <div className="detail-value">{data.wind.speed} m/s {windDirection(data.wind.deg)}</div>
            <div className="detail-label">Wind</div>
          </div>
        </div>
        
        <div className="detail-item">
          <WiBarometer className="detail-icon" />
          <div>
            <div className="detail-value">{data.main.pressure} hPa</div>
            <div className="detail-label">Pressure</div>
          </div>
        </div>
        
        <div className="detail-item">
          <WiSunrise className="detail-icon" />
          <div>
            <div className="detail-value">{sunrise}</div>
            <div className="detail-label">Sunrise</div>
          </div>
        </div>
        
        <div className="detail-item">
          <WiSunset className="detail-icon" />
          <div>
            <div className="detail-value">{sunset}</div>
            <div className="detail-label">Sunset</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;