'use strict';

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/weather', async (req, res) => {
  try {
    const weatherQuery = req.query.searchQuery;
    const weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?city=${weatherQuery}&key=${process.env.WEATHER_API_KEY}`;
    const weatherResponse = await axios.get(weatherURL);
    let forecastArray = weatherResponse.data; 
    let newArray = [];
    forecastArray.data.map( (value) => {
    newArray.push(new Forecast(value.datetime, `Low of ${value.low_temp}, High of ${value.high_temp} with ${value.weather.description.toLowerCase()}`))
    })
    res.send(newArray);
  } catch (error) {
    console.log('error status:' + error.response.status);
  }
});

app.get('/movies', async (req, res) => {
  try {
    const movieQuery = req.query.searchQuery;
    const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${movieQuery}&include_adult=false`;
    const movieResponse = await axios.get(movieURL);
    let movieArray = movieResponse.data.results;
    let newArray = [];
    movieArray.map( value => {
      newArray.push(new Movie(value.original_title, value.overview, value.vote_average, value.vote_count, value.poster_path, value.popularity, value.release_date));
    });
    console.log(movieArray);
    console.log(newArray);

    res.send(newArray);
  } catch (error) {
    console.log('error status:' + error.response.status);
  }
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

class Movie {
  constructor(title, overview, avgVotes, totalVotes, image_URL, popularity, releasedOn) {
    this.title = title;
    this.overview = overview;
    this.avgVotes = avgVotes;
    this.totalVotes = totalVotes;
    this.image_URL = 'https://image.tmdb.org/t/p/w500/' + image_URL;
    this.popularity = popularity;
    this.releasedOn = releasedOn;
  }
}