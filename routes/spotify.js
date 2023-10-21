const router = require('express').Router();
const querystring = require('querystring');

const spotifyApi = require("../config/connection");
const { generateRandomString } = require('../utils/generateRandomString');

const CLIENT_ID = process.env.SPOTIFY_ClIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

require('dotenv').config();

router.get('/login', function(req, res) {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }));
})

router.get('/auth/spotify', (req, res) => {
    const scope = 'user-library-read';

    try {
        const authorizationUrl = `https://accounts.spotify.com/authorize` + 
        `?response_type=code` +
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${REDIRECT_URI}` +
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

    // spotifyApi.authorizationCodeGrant(code)
    // .then((data) => {
    //   console.log('The token expires in ' + data['expires_in']);
    //   console.log('The access token is ' + data['access_token']);
    //   console.log('The refresh token is ' + data['refresh_token']);

    //   window.localStorage.setItem('token', data['access_token'])

    //   res.redirect('/');
    // })
    // .catch((err) => {
    //    res.status(500).send(err.message);
    // })
    if (state === null) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {
        var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
          },
          json: true
        };
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