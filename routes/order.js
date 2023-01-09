const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const User = require('../models/User')
const Order = require('../models/Order')
const promiseWrapper = require('../utilities/promiseWrapper');
const { checkCategory, ensureLogin, checkAdmin } = require('../middleware');

// router.delete('/cart/:productId',promiseWrapper(async (req,res)=>{
//     const {productId} = req.params;

//     res.redirect('/layouts/cart/index');
// }))

// router.get('/order', checkCategory, ensureLogin, promiseWrapper(async (req, res) => {
//     const id = req.user._id;
//     const user = await User.findById(id).populate('cart');
//     res.render('layouts/cart/index',{user});
// }))

module.exports = router;