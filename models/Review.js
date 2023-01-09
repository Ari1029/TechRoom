const mongoose = require('mongoose');
const User = require('./User')

const ReviewSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description:{
        type: String,
        required: [true,'must include a review']
    },
    level:{
        type: Number,
        required: [true, 'must give a rating out of 5']
    }
})

module.exports = mongoose.model('Review', ReviewSchema);