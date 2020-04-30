'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose schema for token objects
 */

let tokenSchema = new mongoose.Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, required: true, 
        default: Date.now, expires: 43200 
    }
});


module.exports = mongoose.model('TokenSchema', tokenSchema);