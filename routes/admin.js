const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const promiseWrapper = require('../utilities/promiseWrapper');
const { checkCategory, ensureLogin, checkAdmin } = require('../middleware');
const Order = require('../models/Order');
const multer = require('multer');
const {storage} = require('../cloudinary');

router.get('/management',ensureLogin, checkAdmin, promiseWrapper(async(req,res)=>{
    const orders = await Order.find({}).populate('user').populate('products');
    res.render('order/management',{orders});
}))

router.post('/management',ensureLogin, checkAdmin, promiseWrapper(async(req,res)=>{
    const {status, id} = req.body;
    const order = await Order.findById(id).populate('user').populate('products');
    order.status = status;
    order.save();
    res.redirect('/techroom/management');
}))


module.exports = router;