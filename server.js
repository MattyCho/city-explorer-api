'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const getMovies = require('./modules/movie.js');
const getWeather = require('./modules/weather.js');

dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/weather', weatherHandler)

function weatherHandler(req, res) {
  const weatherQuery = req.query.searchQuery;
  getWeather(weatherQuery)
    .then(weatherList => res.send(weatherList))
    .catch(error => console.log(error));
}

app.get('/movies', movieHandler);

function movieHandler(req, res) {
  const movieQuery = req.query.searchQuery;
  getMovies(movieQuery)
    .then(moviesList => res.send(moviesList))
    .catch(error => console.log(error));
}

app.use('*', notFoundHandler);

function notFoundHandler(req, res) {
  res.status(404).send('Sorry! Route not found');
}

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});