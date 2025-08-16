import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGeolocated } from 'react-geolocated';
import { FiInfo } from 'react-icons/fi';
import LocationInput from './components/LocationInput';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loading from './components/Loading';
import WeatherBackground from './components/WeatherBackground';
import ManualQueryForm from './components/ManualQueryForm';
import UpdateQueryModal from './components/UpdateQueryModal';
import InfoModal from './components/InfoModal';
import './App.css';

const BACKEND_URL = 'http://localhost:3001/api/weather';
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('weatherUnit') || 'C');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState('default');
  const [lastCoords, setLastCoords] = useState(null);
  const [savedQueries, setSavedQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [updateModal, setUpdateModal] = useState({ isOpen: false, query: null });
  const [showInfo, setShowInfo] = useState(false);

  const fetchSavedQueries = async () => {
    try {
      setLoadingQueries(true);
      const response = await axios.get(BACKEND_URL);
      setSavedQueries(response.data);
    } catch (error) {
      console.error('Error fetching saved queries:', error);
      setError('Failed to fetch saved queries');
    } finally {
      setLoadingQueries(false);
    }
  };

  const deleteQuery = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      fetchSavedQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
      setError('Failed to delete query');
    }
  };

  const loadSavedQuery = async (query) => {
    try {
      if (query.weatherData?.current) {
        setWeatherData(query.weatherData.current);
        setForecastData(query.weatherData.forecast);
        setWeatherTheme(query.weatherData.current.weather[0].main);
        setLastUpdated(new Date(query.updatedAt || query.createdAt));
        setLastCoords(query.coordinates);
        setError(`Showing weather data from ${new Date(query.createdAt).toLocaleString()}`);
      } else {
        await handleSearch(query.location);
      }
    } catch (error) {
      console.error('Error loading saved query:', error);
      setError('Failed to load saved weather data');
    }
  };

  useEffect(() => {
    fetchSavedQueries();
  }, []);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  const setWeatherTheme = (weatherCondition) => {
    const condition = weatherCondition.toLowerCase();
    if (condition.includes('rain')) setTheme('rainy');
    else if (condition.includes('cloud')) setTheme('cloudy');
    else if (condition.includes('clear')) setTheme('sunny');
    else if (condition.includes('snow')) setTheme('snowy');
    else if (condition.includes('thunder')) setTheme('stormy');
    else setTheme('default');
  };

  const fetchWeather = async (latitude, longitude, unitParam = unit, locationName = '', shouldSave = true) => {
    setLastCoords({ latitude, longitude });
    setLoading(true);
    setError(null);

    try {
      const units = unitParam === 'C' ? 'metric' : 'imperial';

      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`),
        axios.get(`${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`)
      ]);

      if (shouldSave) {
        try {
          await axios.post(BACKEND_URL, {
            location: locationName || weatherResponse.data.name || `${latitude},${longitude}`,
            coordinates: { lat: latitude, lon: longitude },
            dateRange: {
              start: new Date(),
              end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            weatherData: {
              current: weatherResponse.data,
              forecast: forecastResponse.data
            }
          });
          fetchSavedQueries();
        } catch (saveError) {
          console.error('Error saving weather data:', saveError);
        }
      }

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setWeatherTheme(weatherResponse.data.weather[0].main);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (location) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/weather?q=${location}&appid=${API_KEY}`);
      await fetchWeather(response.data.coord.lat, response.data.coord.lon, unit, location);
    } catch (err) {
      setError('Location not found. Please try another location.');
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (coords) {
      fetchWeather(coords.latitude, coords.longitude);
    } else if (!isGeolocationAvailable) {
      setError('Geolocation is not available in your browser.');
    } else if (!isGeolocationEnabled) {
      setError('Please enable geolocation permissions for this site.');
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('weatherUnit', newUnit);
    if (lastCoords) {
      fetchWeather(lastCoords.latitude, lastCoords.longitude, newUnit, '', false);
    }
  };

  useEffect(() => {
    if (coords && isGeolocationAvailable && isGeolocationEnabled) {
      fetchWeather(coords.latitude, coords.longitude);
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  const formatTemperature = (temp, unit) => {
    return `${Math.round(temp)}°${unit}`;
  };

  return (
    <div className={`app ${theme}`}>
      <WeatherBackground condition={theme} />
      
      <div className="weather-container">
        <header className="app-header">
          <div className="header-content">
            <h1>Weather Forecast</h1>
            <div className="credits">
              <span>By Navreet Kaur</span>
              <button 
                className="info-button" 
                onClick={() => setShowInfo(true)}
              >
                <FiInfo /> About PM Accelerator
              </button>
            </div>
          </div>
          <LocationInput 
            onSearch={handleSearch} 
            onUseCurrentLocation={handleUseCurrentLocation} 
          />
        </header>

        {loading && <Loading />}
        {error && <div className="error-message">{error}</div>}

        <main className="weather-content">
          {weatherData && (
            <>
              <CurrentWeather 
                data={weatherData} 
                unit={unit} 
                onUnitChange={toggleUnit} 
              />
              <div className="last-updated">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
            </>
          )}
          
          {forecastData && <Forecast data={forecastData} unit={unit} />}
          
          <div className="saved-queries">
            <h3>Saved Queries ({savedQueries.length})</h3>
            
            {loadingQueries && <div>Loading saved queries...</div>}
            
            {savedQueries.length === 0 && !loadingQueries && (
              <p>No saved queries yet. Search for weather to save queries automatically.</p>
            )}
            
            {savedQueries.map(query => (
              <div key={query._id} className="query-item">
                <div className="query-header">
                  <h4>{query.location}</h4>
                  <div className="query-actions">
                    <button 
                      onClick={() => loadSavedQuery(query)}
                      className="load-button"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteQuery(query._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="query-details">
                  <p className="query-date">
                    Saved: {new Date(query.createdAt || query.dateRange.start).toLocaleDateString()} 
                    {' at '} 
                    {new Date(query.createdAt || query.dateRange.start).toLocaleTimeString()}
                  </p>
                  
                  {query.coordinates && (
                    <p className="query-coords">
                      Lat: {query.coordinates.lat?.toFixed(4)}, 
                      Lon: {query.coordinates.lon?.toFixed(4)}
                    </p>
                  )}
                  
                  {query.weatherData?.current && (
                    <div className="query-weather-preview">
                      <p>
                        <strong>{query.weatherData.current.weather?.[0]?.main}</strong>
                        {' - '}
                        {formatTemperature(query.weatherData.current.main?.temp, 'C')}
                      </p>
                      <p className="weather-description">
                        {query.weatherData.current.weather?.[0]?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="app-footer">
          <p>Weather data provided by OpenWeatherMap</p>
        </footer>

        {showInfo && <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />}
      </div>
    </div>
  );
};

export default App;