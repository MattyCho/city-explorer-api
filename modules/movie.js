'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function getMovies(location) {
  const key = 'movies-' + location;
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${location}&include_adult=false`;

  if(!cache[key]) {
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(movieURL)
      .then(data => parseMovieData(data.data))
  }
  return cache[key].data;

  // axios.get(movieURL)
  //   .then(data => {
  //     const movieArray = data.data.results;
  //     let formattedMovieArray = movieArray.map( movie => {
  //       return new Movie(movie);
  //     });
  //     console.log(formattedMovieArray);
  //     return Promise.resolve(formattedMovieArray);
  //   })
  //   .catch (error => {
  //     console.log('error status:' + error);
  //     return Promise.reject(error);
  //   })
}

function parseMovieData(data) {
  try {
    const movies = data.results.map(movie => {
      return new Movie(movie);
    })
    return Promise.resolve(movies);
  } catch (err) {
    return Promise.reject(err);
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.original_title;
    this.overview = movie.overview;
    this.avgVotes = movie.vote_average;
    this.totalVotes = movie.vote_count;
    this.image_URL = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    this.popularity = movie.popularity;
    this.releasedOn = movie.release_date;
    this.timestamp = Date.now;
  }
}

module.exports = getMovies;