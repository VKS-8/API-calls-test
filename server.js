import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

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
app.use(dotenv.config());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/getWeather', (req, res) => {
  res.json('Hello');
});

app.post('/getWeather', async (req, res) => {
  const { zip, countryCode, feelings } = res.body;

  try {
    const apiKey = 'a308e7287b4c480280bef12289998f2c';
    const endpoint = new URL(`http://api.openweathermap.org/data/2.5/weather?${setZipParams}&APPID=${apiKey}`);
    const setZipParams = `zip=${zip},${countryCode}`;
    console.log(endpoint);

    const weatherData = await fetch('/getWeather', endpoint);
    const weatherJson = await weatherData.json();

    // Extract relevant weather information
    const { temp, humidity } = weatherJson.current;

    // Get the current date
    const currentDate = new Date().toLocaleDateString();

    // Create a response object with the weather data and feelings input
    const response = {
      date: currentDate,
      temperature: weatherJson.current.main.temp,
      humidity: weatherJson.current.main.humidity,
      feelings: feelings
    };

    res.json(response);
    response.end;
  } catch (error) {
    console.log('Error occurred:', error);
    res.status(500).json({ error: 'Unable to complete your request.  Please try again.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
