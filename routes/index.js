const express = require('express')
const route = express.Router();

const api = require('./index')

route.use('/api', api);

module.exports = route;

