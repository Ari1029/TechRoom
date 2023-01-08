const express = require('express');
const router = express.Router({mergeParams: true});
const Product = require('../models/Product');
const promiseWrapper = require('../utilities/promiseWrapper');
const {checkCategory} = require('../middleware');

//Load specific page
router.get('/:category', promiseWrapper(async (req,res)=>{
    const {category} = req.params;
    checkCategory(category,'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories');
    
        const products = await Product.find({category: category});
        res.render('layouts/standard',{products});
    
}))

//get create form
router.get('/:category/new',(req,res)=>{
    const {category} = req.params;
    checkCategory(category,'Cannot create a product of invalid type')
    res.render('layouts/tech/create') //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Get update form
router.get('/:category/:id/update',(req,res)=>{
    const {category} = req.params;
    checkCategory(category,'Cannot create a product of invalid type')
    res.render('/layouts/tech/update') //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Load specific product
router.get('/:category/:id', promiseWrapper(async(req,res)=>{
    const {category, id} = req.params;
    checkCategory(category,'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories')

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
    checkCategory(category,'Cannot create products of this type')

    const product = new Product(req.body);
    await product.save();
    const products = await Product.find({category: category});
    res.redirect('layouts/tech/index',{products})
})

//Update product data form, should prepopulate form with all current data
router.patch('/:category/:id',async(req,res)=>{
    const {category, id} = req.params.id;
    checkCategory(category,'Invalid Product Type, please select from our collection of laptops, tablets, phones and other tech-related accessories')
    const product = findByIdAndUpdate(id,{...req.body});
    res.redirect('/layouts')
})

module.exports = router;