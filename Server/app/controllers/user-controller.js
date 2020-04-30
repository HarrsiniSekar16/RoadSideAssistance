'use strict';
const userService = require('../services/user.service');
const nJwt = require('njwt');
const config = require('../config');
const mongoose = require('mongoose');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const usermodel = mongoose.model('UserSchema');
const userreqmodel = mongoose.model('UserRequestSchema');
let CryptoJS = require("crypto-js");
const tokenmodel = mongoose.model('TokenSchema');
const path = require('path');
const fs = require('fs');

// method to retrieve the values from the resource
// @params - req, resp
exports.authenticate = (request, response) => {
    const userId = request.params.id;
    const userContent = Object.assign({}, request.body);
    const usermodels = new usermodel(userContent);
    const promise = userService.auth(userId);
    // check for pwd match 
    // https://developer.okta.com/blog/2019/05/16/angular-authentication-jwt
    const result = (authSuccess) => {
        if (authSuccess != null) {
            //set response to 200
            response.status(200);
            let userPwd = CryptoJS.AES.decrypt(authSuccess.userPassword.toString(), '123456$#@$^@1ERF');
            let pwd = CryptoJS.AES.decrypt(usermodels.userPassword.toString(), '123456$#@$^@1ERF')
            if (pwd.toString(CryptoJS.enc.Utf8) == userPwd.toString(CryptoJS.enc.Utf8) && authSuccess.isVerified) {
                var jwt = nJwt.create({ id: userId }, config.secret);
                jwt.setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000));
                response.json({ auth: true, token: jwt.compact(), user: authSuccess });
            } else {
                response.json({ auth: false, message: "Invalid User" });
            }
        } else {
            response.json({ auth: false, message: "User Not Found" });
        }
    };
    promise.then(result)
        .catch(renderErrorResponse(response));
};
// method to register the values to the resource
// @params - req, resp

exports.register = (req, res) => {
    const userToReg = Object.assign({}, req.body);
    const newuser = new usermodel(userToReg);
    newuser.userPassword = CryptoJS.AES.encrypt(newuser.userPassword.toString(), '123456$#@$^@1ERF');

    const result = (register) => {
        res.json(register);
    };

    const promise = userService.save(newuser);
    promise.then(result)
        .catch(renderErrorResponse(res));
};


// method to confirm the email from the resource
// @params - req, resp

exports.confirmationPost = (req, res) => {
    const verificationCode = req.body.verificationCode;
    const userEmail = req.body.userEmail;

    const result = (confirmation) => {
        res.json(confirmation);
    };

    const promise = userService.confirmToken(verificationCode, userEmail);
    promise.then(result)
        .catch(renderErrorResponse(res));
};


// method to resend the token generated for email 
// @params - req, resp

exports.resendTokenPost = function(req, res) {
    const userEmail = req.body.userEmail;

    const result = (resend) => {
        res.json(resend);
    };

    const promise = userService.resendToken(userEmail);
    promise.then(result)
        .catch(renderErrorResponse(res));

};



// method to update the values from the resource
// @params - req, resp

exports.updateUser = (request, response) => {
    const userId = request.params.id;
    const user = Object.assign({}, request.body);

    // get the body fRom the req
    user.id = userId;
    const result = (todo) => {
        response.status(200);
        response.json(todo);
    };
    const promise = userService.update(user);
    promise.then(result).catch(renderErrorResponse(response));
};


// method to retrieve the values from the resource
// @params - req, resp
exports.getUser = (request, response) => {
    const userid = request.params.id;
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    const promise = userService.get(userid);
    promise.then(result)
        .catch(renderErrorResponse(response));
};


// method to retrieve all the values from the resource based on type
// @params - req, resp

exports.getAllUsers = (request, response) => {
    const userType = request.params.type;
    // const usertype = request.params.type;
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    const promise = userService.getAll(userType);
    promise.then(result)
        .catch(renderErrorResponse(response));
}

// method to handle the error response
// @params - resp
let renderErrorResponse = (response) => {
    const errorCallBack = (error) => {
        if (error) {
            if (error.message.includes("unable") || error.message.includes("already")) {
                response.status(400);
            } else {
                response.status(500);
            }
            response.json({
                msg: error.message
            });
        }
    };
    return errorCallBack;
};