const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ClIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

spotifyApi.clientCredentialsGrant()
.then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
    console.log('Error retrieving access token:', error);
})

module.exports = spotifyApi;
