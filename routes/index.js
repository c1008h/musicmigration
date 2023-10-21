const router = require('express').Router();
const spotifyRoutes = require('./spotify')

router.use('/spotify', spotifyRoutes);

router.use((req, res) => {
    return res.send('Welcome to music migration!')
})

module.exports = router;