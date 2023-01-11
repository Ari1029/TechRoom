const mongoose = require('mongoose');
const Review = require('./Review')

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'must include a product name']
    },
    productQuantity:{
        type: String,
        required: [true, 'must include a product quantity']
    },
    description:{
        type: String,
        // required: [true,'must include a description']
    },
    price:{
        type: Number,
        required: [true, 'product must have a price']
    },
    purchaseDate:{
        type: Number,
    },
    category:{
        type: String,
        enum: ['laptops','tablets','phones','accessories'],
        required: [true,'must include a category for product']
    },
    image: {
        url: String,
        filename: String
        // required: [true,'must upload an image of this product']
    },
    reviews:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
    },
    date:{
        type: Number
    },
    helper:{
        type: Number,
        default: 0
    }
    //we use helper as a way to pull all the elements from the array once a user has made an order
})

ProductSchema.post('fineOneAndDelete', async (req)=>{
    if(req) Reviews.remove({_id: {$in: req}});
})

module.exports = mongoose.model('Product',ProductSchema);