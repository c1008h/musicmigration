const route = require('express').Router();
const user = require('./user');
const data = require('./data');


route.use('/user', user);
route.use('/data', data);

module.exports = route;
