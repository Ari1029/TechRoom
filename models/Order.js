const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');
const Address = require('./Address');

const OrderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    date:{
        type: Number
    },
    country:{
        type: String,
    },
    postalCode:{
        type: String,
    },
    city:{
        type: String,
    },
    streetAddress:{
        type: String,
    },
    status:{
        type: String,
        enum: ['Pending','Shipped','Delivered']
    },
    totalPrice:{
        type: Number
    }
    
})

module.exports = mongoose.model('Order', OrderSchema);