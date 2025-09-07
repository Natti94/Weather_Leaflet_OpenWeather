import { useState, useEffect } from "react";
import { WeatherData, ForeCastData } from "../../services/weather/weather";
import "./weather.css";

function Weather({ markedPosition, addToFavourites, myPosition, locationFetched }) {
  const [weatherData, setWeatherData] = useState(null);
  const [foreCastData, setForeCastData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      setLoading(true);
      setWeatherData(null);
      setForeCastData([]);
      const weather = await WeatherData(lat, lon);
      setWeatherData(weather);
      const forecast = await ForeCastData(lat, lon);
      setForeCastData(forecast?.list || []);
      setLoading(false);
    };
    let lat, lon;
    if (markedPosition?.lat && markedPosition?.lng) {
      lat = markedPosition.lat;
      lon = markedPosition.lng;
      fetchWeather(lat, lon);
    } else if (locationFetched && myPosition?.length === 2) {
      [lat, lon] = myPosition;
      fetchWeather(lat, lon);
    }
  }, [markedPosition, myPosition, locationFetched]);
  if (loading) {
    return <div>Loading weather data...</div>;
  }
  if (!weatherData) {
    return <div>No weather data available.</div>;
  }
  const handleAddToFavourites = () => {
    const favouriteDataAdd = {
      id: Date.now(),
      location: weatherData.name,
      lat: markedPosition?.lat || myPosition[0],
      lon: markedPosition?.lng || myPosition[1],
      temp: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      timestamp: Math.floor(Date.now() / 1000),
    };
    addToFavourites(favouriteDataAdd);
  };
  return (
    <div className="weather-section">
      <div className="weather-info">
        <div className="weather-icons">
          <h3>📍</h3>
          <button type="button" onClick={handleAddToFavourites}>⭐</button>
        </div>
        <h4>Location:</h4>
        <p>{weatherData.name}</p>
        <h4>Temperature:</h4>
        <p>{weatherData.main.temp}°C</p>
        <h4>Weather:</h4>
        <p>{weatherData.weather[0].description}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
      </div>
      <div className="forecast-info">
        <h4>5-Day Forecast:</h4>
        <div>
          {foreCastData.length > 0 ? (
            foreCastData
              .filter((_, index) => index % 8 === 0)
              .map((day, index) => (
                <div key={index} className="forecast-card">
                  <h4>Time & Date:</h4>
                  <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                  <h4>Temperature:</h4>
                  <p>{day.main.temp}°C</p>
                  <h4>Weather:</h4>
                  <p>{day.weather[0].description}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="forecast icon"
                  />
                  {"__________"}
                </div>
              ))
          ) : (
            <p>No forecast data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;