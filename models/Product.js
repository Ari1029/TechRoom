const mongoose = require('mongoose');
const Review = require('./Review')

const imgSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const ProductSchema = new mongoose.Schema({
    productQuantity:{
        type: String,
        required: [true, 'must include a product quantity']
    },
    price:{
        type: Number,
        required: [true, 'product must have a price']
    },
    purchaseDate:{
        type: Date,
    },
    category:{
        type: String,
        enum: ['Laptop','Tablet','Phone','Accessory'],
        required: [true,'must include a category for product']
    },
    images: {
        type: [imgSchema],
        required: [true,'must upload an image of this product']
    },
    reviews:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
    }
})

ProductSchema.post('fineOneAndDelete', async (req)=>{
    if(req) Reviews.remove({_id: {$in: req}});
})

module.exports = mongoose.model('Product',ProductSchema);