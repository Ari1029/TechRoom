const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    country:{
        type: String,
        required: [true,'must include country']
    },
    postalCode:{
        type: String,
        required:[true,'must include postal code']
    },
    city:{
        type: String,
        required: [true,'must include a city']
    },
    streetAddress:{
        type: String,
        required: [true,'must include a street address']
    }
})

module.exports = mongoose.model('Address', AddressSchema);