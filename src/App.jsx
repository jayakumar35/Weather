import { useEffect, useState } from 'react'
import { Container,Row,Col } from 'react-bootstrap';
import './App.css'

let api_key = "11ebfa5d3b36d17b08240af5afa53d99";

// Images
import searchIcon from "./assets/SearchIcon.png"
import clearDay from "./assets/clearday.gif"
import clearNight from './assets/clearnight.gif'
import cloudDay from "./assets/cloudday.gif"
import cloudNight from "./assets/cloudnight.gif"
import rainDay from "./assets/rainday.gif"
import rainNight from './assets/rainnight.gif'
import snowDay from './assets/snowday.gif'
import snowNight from './assets/snownight.gif'
import humidityIcon from "./assets/humidity.gif"
import snowIcon from './assets/snowIcon.gif'
import windIcon from './assets/windIcon.gif'

const WeatherDetails = ({ icon, temp, city, country, lat, lng, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img className='weathericon' src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lng">Longitude</span>
          <span>{lng}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="Wind" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [text, setText] = useState('Tirupur');
  const [icon, setIcon] = useState();
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Tiruppur");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotfound, setCityNotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearDay,
    "01d": clearNight,
    "02d": cloudDay,
    "02n": cloudNight,
    "03d": cloudDay,
    "03n": cloudNight,
    "04d": clearDay,
    "04n": cloudNight,
    "09d": rainDay,
    "09n": rainNight,
    "10d": snowDay,
    "10n": snowNight,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City Not found");
        setCityNotfound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLng(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearDay);
      setCityNotfound(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <Container className='weather-container-fluid' >
    <Row className=''>
      <Col lg={12} sm={12} md={12}>

      <div className="input-container">
        <input
          type="text"
          className='cityInput'
          placeholder='Search City'
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="searchicon" onClick={() => search()}>
          <img src={searchIcon} alt='Search' />
        </div>
      </div>
      {!loading && !cityNotfound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lng={lng}
          humidity={humidity}
          wind={wind}
        />
      )}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">An error occurred: {error}</div>}
      {cityNotfound && <div className="city-not-found">City not found</div>}
      <p className="copyright">
        Designed by <span>Dev Jai</span>
      </p>
    </Col>
    </Row>
    </Container>
  );
}

export default App;
