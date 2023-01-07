const mongoose = require('mongoose');
const Product = require('./Product');
const Review = require('./Review');

const UserSchema = new mongoose.Schema({
    permission: {
        boolean: String,
    },
    email: {
        type: String,
        required: [true, 'user must enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'user must enter a password']
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

module.exports = mongoose.model('User', UserSchema);