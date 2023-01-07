const Product = require('./models/Product');

module.exports.checkCategory = async function (req, res, next) {
    const {category} = req.params;
    if (category != 'phones' && category != 'accessories' && category != 'tablets' && category != 'laptops') {
        throw new Error
    }
    else next();
}

module.exports.checkId = async function(req,res,next){
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        throw new Error;
    }
    else next();
}

//check id, check category