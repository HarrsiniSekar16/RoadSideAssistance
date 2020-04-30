'use strict';

const userRoute = require('./user-route');

// method to route the initiated app 
module.exports = (app) => {
    userRoute(app);
};