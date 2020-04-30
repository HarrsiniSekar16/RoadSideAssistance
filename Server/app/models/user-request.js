'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for rsa objects
 */

let userRequestSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    vendor_id: {
        type: String
    },

    description: {
        type: String,
    },

    created_Date: {
        type: Date
    },

    state: {
        type: String,
    },

    vin: {
        type: String,
        required: true
    },

    register_no: {
        type: String,
        required: true
    },

    image: {
        type: []
    },

    latitude: {
        type: String,
        required: true
    },

    longitude: {
        type: String,
        required: true
    },

    listOfServices: {
        type: []
    },

    totalCost: {
        type: String,
    },
    duration: {
        type: String
    }

}, {
    versionKey: false
});

// Duplicate the id field as mangoose returns _id field instead of id

userRequestSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Ensure virtual functions are serialised 

userRequestSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('UserRequestSchema', userRequestSchema);