import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');

  async function search() {
    if (!city) {
      setWeather("Please enter a city name.");
      return;
    }

    try {
      // Get latitude and longitude for the city using Open-Meteo geocoding
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setWeather("City not found.");
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // Fetch weather data using the coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.current_weather) {
        const { temperature, windspeed } = weatherData.current_weather;
        setWeather(`Temperature: ${temperature}°C, Wind Speed: ${windspeed} km/h`);
      } else {
        setWeather("Weather data not available.");
      }
    } catch (error) {
      setWeather("An error occurred while fetching weather data.");
    }
  }

  return (
    <>
      <div className="box container is-fullhd">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        className="input is-focused"/>
        <button onClick={search} className="btn-primary is-rounded p-4">Search</button>
        <p>{weather}</p>
      </div>
    </>
  );
}

export default App;
