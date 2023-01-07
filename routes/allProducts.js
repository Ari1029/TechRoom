const express = require('express');
const router = express.Router({mergeParams: true});
const Product = require('../models/Product');
const asyncWrapper = require('../utilities/asyncWrapper');

const checkCategory = function(category){
    if(category != 'phones' && category!='accessories' && category!='tablets' && category!='laptops') return false;
    else return true;
}

//Load specific page
router.get('/:category', asyncWrapper(async (req,res)=>{
    const {category} = req.params;
    if(checkCategory(category)===false){
        const message = 'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories'
        return res.render('404',{message});
    }
    else{
        const products = await Product.find({category: category});
        res.render('layouts/standard',{products});
    }
}))

//get create form
router.get('/:category/new',(req,res)=>{
    const {category} = req.params;
    console.log(category);
    if(checkCategory(category)===false){
        const message = 'Cannot create a product of invalid type';
        return res.render('404',{message});
    }
    res.render('layouts/tech/create') //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Get update form
router.get('/:category/:id/update',(req,res)=>{
    const {category} = req.params;
    if(checkCategory(category)===false){
        const message = 'Cannot create a product of invalid type';
        return res.render('404',{message});
    }
    res.render('/layouts/tech/update') //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Load specific product
router.get('/:category/:id', asyncWrapper(async(req,res)=>{
    const {category, id} = req.params;
    if(checkCategory(category)===false){
        const message = 'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories'
        return res.render('404',{message});
    }
    const product = await Product.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'reviews'
        }
    })
    if(!product){
        const message = 'Product does not exist!'
        return res.render('404',{message})
    }
    else{
        res.render('layouts/tech/index')
    }
}))

//Post product data
router.post('/:category',async (req,res)=>{
    const {category} = req.params;
    if(checkCategory(category)===false){
        const message = 'Cannot create products of this type'
        return res.render('404',message);
    }
    const product = new Product(req.body);
    await product.save();
    const products = await Product.find({category: category});
    res.redirect('layouts/tech/index',{products})
})

//Update product data form, should prepopulate form with all current data
router.patch('/:category/:id',async(req,res)=>{
    const {id} = req.params.id;
    if(checkCategory(category)===false){
        const message = 'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories'
        return res.render('404',{message});
    }
    const product = findByIdAndUpdate(id,{...req.body});
    res.redirect('/layouts')
})

module.exports = router;