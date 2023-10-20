const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

console.log('client id', process.env.CLIENT_ID)

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

spotifyApi.clientCredentialsGrant()
.then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
})
.catch(error => {
    console.log('Error retrieving access token:', error);
})