const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');
const Address = require('./Address');

const OrderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderQuantity:{
        type: Number,
        required:[true,'must include order quantity']
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    date:{
        type: Date, 
        required: [true,'must include a date']
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'must include an address to ship to']
    },
    status:{
        type: String,
        enum: ['Pending','Shipped','Delivered']
    }
})

module.exports = mongoose.model('Order', OrderSchema);