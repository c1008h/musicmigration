const router = require('express').Router();
const spotifyApi = require("../config/connection");

router.get('/saved-tracks', (req, res) => {
    spotifyApi.getMySavedTracks()
    .then(data => {
      const savedTracks = data.body.items;
      res.json(savedTracks);
    })
  
    .catch(error => {
      console.log('Error fetching saved tracks: ', error);
      res.status(500).json({ error: 'Failed to fetch saved tracks from spotify.' })
    })
})

module.exports = router;