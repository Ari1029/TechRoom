const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const User = require('../models/User')
const Order = require('../models/Order')
const Address = require('../models/Address')
const promiseWrapper = require('../utilities/promiseWrapper');
const { ensureLogin } = require('../middleware');
const { postcodeValidator} = require('postcode-validator');

// router.delete('/cart/:productId',promiseWrapper(async (req,res)=>{
//     const {productId} = req.params;

//     res.redirect('/layouts/cart/index');
// }))

router.get('/cart', ensureLogin, promiseWrapper(async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate('products');
    res.render('layouts/cart/index',{user});
}))

router.post('/cart', ensureLogin, promiseWrapper(async (req, res) => { //SENT FROM TECH/INDEX PAGE. DISPLAY ALL USER.PRODUCTS ON CART INDEX PAGE
    const id = req.user._id;
    const user = await User.findOne({_id: id});
    const product = await Product.findOne({name: req.body.name});
    user.products.push(product);
    await user.save();
    req.flash('success',`The ${product.name} has been added to your cart`);
    res.redirect(`/techroom/${product.category}`);
}))

router.get('/cart/order',ensureLogin, promiseWrapper(async(req,res)=>{
    const id = req.user._id;
    const user = await User.findOne({_id: id}).populate('products');
    if(user.products.length === 0 ){
        //flash error
        return res.redirect('/techroom/cart')
    }
    const order = new Order;
    order.user = user;
    for(let product of user.products){
        order.products.push(product);
    }
    await order.save();
    res.render('order/order',{order});
}))

router.get('/cart/order/stripe/create-payment',ensureLogin, promiseWrapper(async(req,res)=>{
    const id = req.user._id;
    const date = Date.now();
    const order = await Order.findOneAndUpdate({user: {_id: id}}, {date:date}).populate('products');
    let i=0;
    for(let product of order.products){
        i += product.price;
        product.purchaseDate = parseInt(Date.now());
        await product.save();
    }
    i= i*1.13;
    i=i.toFixed(2);
    order.totalPrice = i;
    await order.save();
    res.render('order/createPayment',{order});
}))

router.post('/cart/order/stripe',ensureLogin,promiseWrapper(async(req,res)=>{
    const id = req.user._id;
    const {country, postalCode, city, streetAddress} = req.body;
    console.log(streetAddress);
    if(streetAddress===''){
        req.flash('pay','Please enter you street address');
        res.redirect('/techroom/cart/order');
    }
    else if(!city){
        req.flash('pay','Please enter your city');
        res.redirect('/techroom/cart/order');
    }
    else if(!postalCode){
        req.flash('pay','Please enter your postal code');
        res.redirect('/techroom/cart/order');
    }
    else if(!country){
        req.flash('pay','Please enter your country');
        res.redirect('/techroom/cart/order');
    }
    else if(postcodeValidator(postalCode, 'CA')===false){
        req.flash('pay','Please enter a valid postal code to ship to');
        res.redirect('/techroom/cart/order');
    }
    else{
    const user = await User.findById(id);
    const order = await Order.findOneAndUpdate({user: {_id: id}}, {streetAddress: streetAddress,country: country,city: city, postalCode: postalCode, status: 'Pending'});
    req.flash('pay',`Continue payment via our currently supported plarforms`);
    res.redirect('/techroom/cart/order/stripe/create-payment');
    }
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