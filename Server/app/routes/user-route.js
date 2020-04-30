'use strict';
const jwtAuth = require('../auth');
const userController = require('../controllers/user-controller');
const userrequestController = require('../controllers/user-request-controller');

module.exports = (app) => {





 
    //for users register
    app.route('/users')
        .post(userController.register);

    //for users based on id

    app.route('/users/:id')
        .get(userController.getUser)
        .post(userController.authenticate)
        .put(jwtAuth, userController.updateUser);


    // for vendors
    app.route('/vendors/:type')
        .get(jwtAuth, userController.getAllUsers);

    // for user requests based on id and type
    app.route('/userrequests/:id/:type')
        .get(jwtAuth, userrequestController.list);
    app.route('/userrequests')
        .post(jwtAuth, userrequestController.save);
    app.route('/userrequests/:id')
        .put(jwtAuth, userrequestController.update);


    //for registration 

    app.route('/registration')
        .post(userController.confirmationPost);
    app.route('/resendtoken')
        .post(userController.resendTokenPost);

};