const Product = require('./models/Product');
const express = require('express');

module.exports.checkCategory = function(category,message){
    if(category != 'phones' && category!='accessories' && category!='tablets' && category!='laptops'){
        return res.render('404',{message});
    }
}

module.exports.ensureLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        const message = 'You must be signed in to use this functionality!'
        res.render('404', {message});
    }
    next();
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