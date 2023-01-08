const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const Order = require('../models/Order')
const promiseWrapper = require('../utilities/promiseWrapper');
const { checkCategory } = require('../middleware');

// router.delete('/cart/:productId',promiseWrapper(async (req,res)=>{
//     const {productId} = req.params;

//     res.redirect('/layouts/cart/index');
// }))

router.get('/cart', promiseWrapper(async (req, res) => {
    const { id } = req.user._id;
    const user = User.findById(id).populate('cart');
    res.render('/layouts/cart/index')
}))

router.post('/cart', promiseWrapper(async (req, res) => { //SENT FROM TECH/INDEX PAGE. DISPLAY ALL USER.PRODUCTS ON CART INDEX PAGE
    const { category } = req.params;
    const { id } = req.user._id;
    const user = await User.findById(id);
    const product = await Product.findById(req.body);
    user.products.push(product);
    await user.save();
    res.redirect(`/${category}`);
}))

//add to cart from product page, select quantity on product page, prepopulate the data

//const order = await find({user: {_id: req.user._id}})
// if(!order){
//     const user = await findById(userId);
//     const orderQuantity = 1;
//     const newOrder = new Order({user: user},{orderQuantity: orderQuantity});
//     newOrder.products.push()
// }

module.exports = router;