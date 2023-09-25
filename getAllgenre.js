const superAgent = require('superagent');
const fs = require('fs');

superAgent
  .get('https://api.spotify.com/v1/recommendations/available-genre-seeds')
  .then((err, res) => {
    console.log(res.body);
  });
