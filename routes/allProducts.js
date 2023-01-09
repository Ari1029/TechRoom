const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const promiseWrapper = require('../utilities/promiseWrapper');
const { checkCategory, ensureLogin, checkAdmin } = require('../middleware');
const User = require('../models/User')

//Load specific page
router.get('/:category', checkCategory, promiseWrapper(async (req, res) => {
    if(req.user){
        const id=req.user._id;
        const user = await User.findById(id);
        const { category } = req.params;
        const products = await Product.find({ category: category });
        return res.render('layouts/tech/indexAdmin', { products, page: category, user});
    }
    else{
        const { category } = req.params;
        const products = await Product.find({ category: category });
        return res.render('layouts/tech/index', { products, page: category});
    }
}))

//get create form, we check if user is an admin using req.user._id and deny request if not. Have a link on the page to add a product if admin.
router.get('/:category/new', checkCategory, ensureLogin, (req, res) => {
    const { category } = req.params;
    res.render('layouts/tech/create', { page: category }) //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Get update form, we check if user is an admin using req.user._id and deny request if not. Have a link on the page to add a product if admin.
router.get('/:category/:id/update', checkCategory, ensureLogin, checkAdmin, (req, res) => {
    res.render('/layouts/tech/update') //when we render this form, we check if browserUser.permission is true or false and render/dont render the form depending on that
})

//Load specific product
router.get('/:category/:id', checkCategory, promiseWrapper(async (req, res) => {
    const { category, id } = req.params;
    const product = await Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'reviews'
        }
    })
    if (!product) {
        const message = 'Product does not exist!'
        return res.render('404', { message })
    }
    else {
        res.render('layouts/tech/show', { product })
    }
}))

//Post product data
router.post('/:category', checkCategory, ensureLogin, async (req, res) => {
    const { category } = req.params;
    console.log(req.body)
    const product = new Product(req.body);
    product.category = category;
    await product.save();
    const products = await Product.find({ category: category });
    res.redirect(`/techroom/${category}`)
})

//Update product data form, should prepopulate form with all current data
router.patch('/:category/:id', checkCategory, ensureLogin, checkAdmin, async (req, res) => {
    const { category, id } = req.params.id;
    const product = findByIdAndUpdate(id, { ...req.body });
    res.redirect('/layouts')
})

router.get('/:category/:id', checkCategory, async(req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        const error = {
            message: 'That product does not exist!',
            statusCode: 404
        }
        return res.send('404',{error})
    }
    res.render('layouts/tech/show',{product});
})

module.exports = router;