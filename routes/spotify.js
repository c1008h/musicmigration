const router = require('express').Router();
const querystring = require('querystring');
const axios = require('axios');
require('dotenv').config();

const spotifyApi = require("../config/connection");
const { generateRandomString } = require('../utils/generateRandomString');

const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CLIENT_ID = process.env.SPOTIFY_ClIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

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

        axios(authOptions) 
        .then((response) => {
            console.log('RESPONSE:', response.data)
            var access_token = response.data.access_token;
            var refresh_token = response.data.refresh_token;

            res.redirect('/');
        })
        .catch((error) => {
            console.log("ERRORORRRR")
            console.log('error', error);
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                })
            )
        })
    }
})

// router.get('/refresh_token', function(req, res) {
//     var refresh_token = req.query.refresh_token;
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
//       form: {
//         grant_type: 'refresh_token',
//         refresh_token: refresh_token
//       },
//       json: true
//     };
  
//     axios(authOptions) 
//     .then((response) => {
//       if (response.response.status === 200) {
//         var access_token = body.access_token;
//         res.send({
//           'access_token': access_token
//         });
//       }
//     })
//     .catch((error) => {
//         console.log('Error:', error)
//     })
// });
  
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