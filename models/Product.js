const mongoose = require('mongoose');
const Review = require('./Review')

const imgSchema = new mongoose.Schema({
    url: String,
    filename: String
})

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
        type: imgSchema,
        // required: [true,'must upload an image of this product']
    },
    reviews:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
    },
})

ProductSchema.post('fineOneAndDelete', async (req)=>{
    if(req) Reviews.remove({_id: {$in: req}});
})

module.exports = mongoose.model('Product',ProductSchema);