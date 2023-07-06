import fetch from 'node-fetch';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('website', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.post('/weather', async (req, res) => {
  const { zip, feelings } = req.body;

  try {
    const apiKey = '31f678bba3c481a6499309ca1c6a2874';
    const weatherData = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${zip}`);
    const weatherJson = await weatherData.json();

    // Extract relevant weather information
    const { temp_c, humidity } = weatherJson.current;

    // Get the current date
    const currentDate = new Date().toLocaleDateString();

    // Create a response object with the weather data and feelings input
    const response = {
      date: currentDate,
      temperature: temp_c,
      humidity: humidity,
      feelings: feelings
    };

    res.json(response);
  } catch (error) {
    console.log('Error occurred:', error);
    res.status(500).json({ error: 'Unable to complete your request.  Please try again.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
