const Product = require('./models/Product');
const express = require('express');
const User = require('./models/User')

module.exports.checkCategory = (req, res, next) => {
    const { category } = req.params;
    if (category != 'phones' && category != 'accessories' && category != 'tablets' && category != 'laptops') {
        const error = {
            message: 'Page not found. Please check your url!',
            statusCode: 404
        }        
        return res.render('404', { error });
    }
    next();
}

//UPDATE THESE TO SEND FLASHES INSTEAD PROMPTING THE USER TO LOGIN OR STATING THEY DO NOT HAVE ADMIN PRIVELEGES
module.exports.ensureLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.return = req.url;
        let real = req.url.slice(1);
        req.flash('pay',`Please login to continue your access to ${real}`)
        return res.redirect('/techroom');
    }
    next();
}

module.exports.checkAdmin = async (req, res, next) => {
    const id = req.user._id;
    const user1 = await User.findById(id).populate('products');
    console.log(user1);
    if (user1.permission === false) {
        req.flash('error', `User accounts do not have access to this page!`)
        return res.redirect('/techroom')
    }
    next();
}

module.exports.checkId = async function (req, res, next) {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new Error;
    }
    else next();
}

//check id, check category