'use strict';
const userService = require('../services/userrequest.service');
const nJwt = require('njwt');
const config = require('../config');
const mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const usermodel = mongoose.model('UserSchema');
const userreqmodel = mongoose.model('UserRequestSchema');
let CryptoJS = require("crypto-js");
const tokenmodel = mongoose.model('TokenSchema');


// method to retrieve the list of values from the resource
// @params - req, resp

exports.list = (request, response) => {
    const userId = request.params.id;
    const type = request.params.type;
    const promise = userService.search(userId,type);

    const result = (user) => {
        //set response to 200
        response.status(200);
        // set the json value to the todo object
        response.json(user);
    };
        promise.then(result)
        .catch(renderErrorResponse(response));
};


// method to save the values from the user
// @params - req, resp

exports.save = (req, res) => {
    const user = Object.assign({}, req.body);
    const result = (userRequest) => {
        res.status(201);
        res.json(userRequest);
    };
    const promise = userService.save(user);
    promise.then(result)
        .catch(renderErrorResponse(res));
};


// method to update the values from the resource
// @params - req, resp

exports.update = (req, res) => {
    const reqID = req.params.id;
    const reqbody = Object.assign({}, req.body);
    // get the body fRom the req
    reqbody.id = reqID;
    const result = (user) => {
        res.status(200);
        res.json(user);
    };
    const promise = userService.update(reqbody);
    promise.then(result).catch(renderErrorResponse(res));
};


// method to handle the error response
// @params - resp
let renderErrorResponse = (response) => {
    const errorCallBack = (error) => {
        if (error) {
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallBack;
};