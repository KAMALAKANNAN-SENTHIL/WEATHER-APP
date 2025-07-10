import { useEffect, useState } from 'react';
import './App.css';

import searchIcon from './assets/search.png';
import cloudIcon from './assets/cloud.png';
import humidityIcon from './assets/humidity.png';
import windIcon from './assets/wind.png';
import drizzleIcon from './assets/drizzle.png';
import clearIcon from './assets/clear.png';
import rainIcon from './assets/rain.png';
import mistIcon from './assets/mist.png';
import snowIcon from './assets/snow.png';
import video from './assets/cloudyvideo.mp4';

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <div className="weather-box">
      <div className="image">
        <img src={icon} alt="weather icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude:</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">Longitude:</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('Chennai');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState('Chennai');
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": mistIcon,
    "50n": mistIcon
  };

  const search = async () => {
    setLoading(true);
    let api_key = "f00a179a627b7fe41a40cb385a16db06";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === '404') {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setCity(data.name);
      setCountry(data.sys.country);
      setTemp(Math.floor(data.main.temp));

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);

      setCityNotFound(false);
      setError(null);
    } catch (err) {
      console.error("Error:", err.message);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
  <div className="app-wrapper">
    <video autoPlay muted loop playsInline className="bg-video">
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div className="container">
      {/* Search Bar */}
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter city name"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon" onClick={search}>
          <img src={searchIcon} alt="Search" />
        </div>
      </div>

      {/* Loading / Error / Not Found */}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}

      {/* Weather Details */}
      {!loading && !cityNotFound && !error && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />
      )}

      <p className="copyright">Designed by: <span>KAMAL</span></p>
    </div>
  </div>
</>

  );
}

export default App;
