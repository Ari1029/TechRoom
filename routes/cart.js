const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const User = require('../models/User')
const Order = require('../models/Order')
const Address = require('../models/Address')
const promiseWrapper = require('../utilities/promiseWrapper');
const { ensureLogin } = require('../middleware');

router.get('/orderSuccess', ensureLogin, promiseWrapper(async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate('products');
    if (user.products.length === 0) {
        req.flash('error', 'You do not have any items in your cart to purchase!')
        return res.redirect('/techroom/cart/order')
    }
    for (let product of user.products) {
        const productId = product._id;
        await User.findByIdAndUpdate(id, { $pull: { products: productId } });
    }
    await user.save();
    const order = await Order.findOne({ user: { _id: id } }).populate('user').populate('products');
    res.render('order/success', { order });
}))

router.get('/cart/order', ensureLogin, promiseWrapper(async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate('products');
    res.render('order/order', { user });
}))

router.delete('/cart/order', ensureLogin, promiseWrapper(async (req, res) => {
    const { productId } = req.body;
    const id = req.user._id;
    const product = await Product.findOne({ _id: productId });
    await User.findByIdAndUpdate(id, { $pull: { products: productId } });
    req.flash('success', `Removed ${product.name} from your cart`);
    res.redirect('/techroom/cart/order');
}))

router.post('/cart', ensureLogin, promiseWrapper(async (req, res) => { //SENT FROM TECH/INDEX PAGE. DISPLAY ALL USER.PRODUCTS ON CART INDEX PAGE
    const id = req.user._id;
    const user = await User.findOne({ _id: id });
    const product = await Product.findOne({ name: req.body.name });
    user.products.push(product);
    await user.save();
    req.flash('success', `The ${product.name} has been added to your cart`);
    res.redirect(`/techroom/${product.category}`);
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