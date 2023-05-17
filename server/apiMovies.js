const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;
app.use(cors());

const options = {
  method: 'GET',
  url: 'https://imdb-top-100-movies1.p.rapidapi.com/',
  headers: {
    'X-RapidAPI-Key': '1b8eccbabbmsh47cbf857f426fb5p1dc6cfjsne1b55dbcb54b',
    'X-RapidAPI-Host': 'imdb-top-100-movies1.p.rapidapi.com'
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// API endpoint to fetch a list of movies
app.get('/movies', (req, res) => {
  axios.request(options).then(response => {
    res.json(response.data);
  }).catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  });
});


// API endpoint to fetch details of a specific movie
app.get('/movies/:movieId', (req, res) => {
  const { movieId } = req.params;

  axios.get(`https://imdb-top-100-movies1.p.rapidapi.com/movies/${movieId}`, options)
    .then(response => {
      const movie = response.data;
      res.json(movie);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
    });
});

