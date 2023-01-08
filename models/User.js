const mongoose = require('mongoose');
const Product = require('./Product');
const Review = require('./Review');
const Order = require('./Order')
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    permission: {
        boolean: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'user must enter a valid email']
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);