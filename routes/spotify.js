const router = require('express').Router();
const spotifyApi = require("../config/connection");
require('dotenv').config();

const scope = 'user-library-read';

router.get('/auth/spotify', (req, res) => {
    try {
        const authorizationUrl = 'https://accounts.spotify.com/authorize' + 
        `?response_type=code` +
        `&client_id=${process.env.SPOTIFY_ClIENT_ID}` +
        `&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}` +
        `&scope=${scope}`;

        res.redirect(authorizationUrl)
    } catch (error) {
        console.log("Error", error.message)
        res.status(500).json({ error: 'An error occurred during authorization.' });
    }
})

router.get('/callback', function(req,res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        )
        
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_ClIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            },
            json: true
          };
        }
    }
})

router.get('/saved-tracks', (req, res) => {
    spotifyApi.getMySavedTracks()
    .then(data => {
      const savedTracks = data.body.items;

      res.json(savedTracks);
    })
  
    .catch(error => {
      console.log('Error fetching saved tracks:', error);
      res.status(500).json({ error: 'Failed to fetch saved tracks from spotify.' })
    })
})

module.exports = router;