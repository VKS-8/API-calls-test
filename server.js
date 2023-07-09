import fetch from 'node-fetch';
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

app.post('/getWeather', async (req, res) => {
  const { zip, countryCode, feelings } = req.body;

  try {
    const apiKey = '3a4f71ba50bab790d1cad75ea3699ce9';
    const baseURL = new URL(`http://api.openweathermap.org/data/2.5/weather?zip=${zip},${countryCode}&`);
    baseURL.searchParams.set("APPID", `${apiKey}`);
    console.log(baseURL);

    const weatherData = await fetch(baseURL);
    const weatherJson = await weatherData.json();

    // Extract relevant weather information
    const { temp_c, humidity } = weatherJson.current;

    // Get the current date
    const currentDate = new Date().toLocaleDateString();

    // Create a response object with the weather data and feelings input
    const response = {
      date: currentDate,
      temperature: weatherJson.current.main.temp_c,
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
