'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const weatherData = require('./data/weather.json');

dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/weather', async (req, res) => {
  let query = req.query.searchQuery
  let matchingData = weatherData.find(value => value.city_name === query)
  let forecastArray = []; 
  matchingData.data.map( (value) => {
  forecastArray.push(new Forecast(value.datetime, `Low of ${value.low_temp}, High of ${value.high_temp} with ${value.weather.description.toLowerCase()}`))
  })
  res.send(forecastArray);
});

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}