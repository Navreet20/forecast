import React from 'react';
import WeatherIcon from './WeatherIcon';

const Forecast = ({ data, unit }) => {
  if (!data || !data.list) return null;

  // Group forecasts by day
  const groupByDay = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });

    if (!groupByDay[date]) {
      groupByDay[date] = { temps: [], weather: [] };
    }

    groupByDay[date].temps.push(item.main.temp);
    groupByDay[date].weather.push(item.weather[0].main);
  });

  // Get daily forecasts with max/min and most frequent weather
  const dailyForecasts = Object.entries(groupByDay)
    .slice(0, 5) // only first 5 days
    .map(([day, info]) => {
      const max = Math.round(Math.max(...info.temps));
      const min = Math.round(Math.min(...info.temps));

      // Find most common weather condition
      const weatherCounts = {};
      info.weather.forEach(w => {
        weatherCounts[w] = (weatherCounts[w] || 0) + 1;
      });
      const mostCommonWeather = Object.entries(weatherCounts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        day,
        max,
        min,
        weather: mostCommonWeather
      };
    });

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-items">
        {dailyForecasts.map((day) => (
          <div key={day.day} className="forecast-item">
            <div className="forecast-day">{day.day}</div>
            <WeatherIcon condition={day.weather.toLowerCase()} size={40} />
            <div className="forecast-temp">
              {day.max}° / {day.min}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
