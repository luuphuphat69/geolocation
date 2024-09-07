import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect, useState } from 'react';

const WeatherCard = ({ value }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=3e1883eaf9154bafa6991736240709&q=${value.latitude},${value.longitude}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };
    if (value) fetchWeather();
  }, [value]);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        {weatherData && (
          <CardMedia component="div" style={{ position: 'relative', height: '300px' }}>
            <img
              src="./giphy.webp"
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              className="giphy-embed"
              allowFullScreen
              title="weather-gif"
            />
          </CardMedia>
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {value.name} / {value.country_name}
          </Typography>
          {weatherData ? (
            <Typography variant="body2" color="text.secondary">
              Temperature °C: {weatherData.current.temp_c}°C<br />
              Temperature °F: {weatherData.current.temp_f}°F<br />
              <Box display="flex" alignItems="center">
                <span>Condition: {weatherData.current.condition.text}</span>
                <img
                  src={`https:${weatherData.current.condition.icon}`}  // Display the small weather icon
                  alt={weatherData.current.condition.text}
                  style={{ marginRight: '8px', width: '32px', height: '32px' }}
                />
              </Box>
              Local Time: {weatherData.location.localtime}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Loading weather data...
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WeatherCard;