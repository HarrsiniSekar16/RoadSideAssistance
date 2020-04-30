'use strict';
const mongoose = require('mongoose');
const userreq = mongoose.model('UserRequestSchema');


// method to search a user in the database

exports.search = (user,type) => {
    if(type == "user"){
        const promise = userreq.find({user_id:user}).exec();
        return promise;
    }else if (type =="vendor"){
        const promise = userreq.find({vendor_id:user}).exec();
        return promise;
    }
    
};


// method to register a value in the database

exports.save = (user) => {
    const newuser = new userreq(user);
    // get the current utc datetime
    let currentdate = new Date();
    // sets the createdDate
    newuser.set("created_Date", currentdate.toLocaleString());
    return newuser.save();
};


// method to update a value in the database

exports.update = (updatereq) => {
    const promise = userreq.findByIdAndUpdate({
        _id: updatereq.id
    }, updatereq, { new: true }).exec();
    return promise;
};