const router = require('express').Router();
const express = require('express')
const app = express();
const queryString = require("node:querystring");
const axios = require("axios");

router.get('/', (req, res) => {
    res.send(
        "<a href='https://accounts.spotify.com/authorize?client_id=" +
        process.env.CLIENT_ID +
        "&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Faccount&scope=user-top-read'>Sign in</a>"
    );
})

router.get("/account", async (req, res) => {
    console.log("spotify response code is " + req.query.code);
    res.send("account page");
});

module.export = router;