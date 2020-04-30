'use strict';
const mongoose = require('mongoose');
const usermodel = mongoose.model('UserSchema');
const userreq = mongoose.model('UserRequestSchema');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
const tokenmodel = mongoose.model('TokenSchema');


// method to search a value in the database
exports.auth = (userId) => {
    const promise = usermodel.findOne({ userEmail: userId }).exec();
    return promise;
};


// method to register an user
exports.save = (newuser) => {
    return new Promise((resolve, reject) => {
        newuser.save(function(err) {
            if (err) { return reject(err) }

            // Create a verification token for this user
            const tokenContent = Object.assign({}, { _userId: newuser._id, token: crypto.randomBytes(16).toString('hex') });
            const token = new tokenmodel(tokenContent);
            // Save the verification token
            token.save(function(err) {
                if (err) { return reject(err) }
                //Send the email    
                const transporter = nodemailer.createTransport({
                    service: 'Sendgrid',
                    auth: {
                        user: 'Pullaingo',
                        pass: 'password-2' // naturally, replace both with your real credentials or an application-specific password
                    }
                });
                var mailOptions = {
                    from: 'roadassistance@roadassistancepullaingo.com',
                    to: newuser.userEmail,
                    subject: 'Account Verification Token For Road Assistance',
                    text: 'Hello,\n\n' + 'Please verify your account by entering the code ' + token.token + ' on the link: \nhttp:\/\/' + 'localhost:4200' + '\/verification' + '\n'

                };

                transporter.sendMail(mailOptions, function(err, info) {

                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        resolve(info);
                    }
                });
            });
        });
    })
}

// method to confirm the token sent
exports.confirmToken = (verificationCode, umail) => {
    return new Promise((resolve, reject) => {
        tokenmodel.findOne({ token: verificationCode }, function(err, token) {
            if (!token) {
                return reject(new Error('We were unable to find a valid token. Your token my have expired.'));
            }
            // If we found a token, find a matching user
            usermodel.findOne({ _id: token._userId, userEmail: umail }, function(err, user) {
                if (!user) return reject(new Error('We were unable to find a user for this token.'));
                if (user.isVerified) return reject(new Error('This user has already been verified.'));

                // Verify and save the user
                user.isVerified = true;
                user.save(function(err) {
                    if (err) { return reject(err) }
                    resolve("The account has been verified. Please log in.");

                });
            });
        });
    })
}

// method to resend the token
exports.resendToken = (umail) => {
    return new Promise((resolve, reject) => {
        usermodel.findOne({ userEmail: umail }, function(err, user) {
            if (!user) return reject(new Error('We were unable to find a user with that email.'));
            if (user.isVerified) return reject(new Error('This user has already been verified.'));

            // Create a verification token, save it, and send email
            const tokenContent = Object.assign({}, { _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            const token = new tokenmodel(tokenContent);

            token.save(function(err) {
                if (err) { return reject(err) }
                //Send the email    
                const transporter = nodemailer.createTransport({
                    service: 'Sendgrid',
                    auth: {
                        user: 'Pullaingo',
                        pass: 'password-2' // naturally, replace both with your real credentials or an application-specific password
                    }
                });
                var mailOptions = {
                    from: 'roadassistance@roadassistancepullaingo.com',
                    to: user.userEmail,
                    subject: 'Account Verification Token For Road Assistance',
                    text: 'Hello,\n\n' + 'Please verify your account by entering the code ' + token.token + ' on the link: \nhttp:\/\/' + 'localhost:4200' + '\/verification' + '\n'

                };

                transporter.sendMail(mailOptions, function(err, info) {

                    if (err) {
                        console.log(err);
                        return reject(err);
                    } else {
                        resolve(info);
                    }
                });
            });

        });
    })
}


// method to get a user value in the database

exports.get = (user) => {
    const getpromise = usermodel.findById(user).exec();
    return getpromise;
};


// method to get all the values in the database

exports.getAll = (userTypes) => {
    const promise = usermodel.find({ userType: userTypes }).exec();
    return promise;
}


// method to update the user value in the database

exports.update = (user) => {

    const promise = usermodel.findByIdAndUpdate({
        _id: user.id
    }, user, { new: true }).exec();
    return promise;
}