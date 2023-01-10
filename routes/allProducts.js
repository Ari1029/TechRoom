const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/Product');
const promiseWrapper = require('../utilities/promiseWrapper');
const { checkCategory, ensureLogin, checkAdmin } = require('../middleware');
const User = require('../models/User');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

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
router.get('/:category/new', checkCategory, ensureLogin, checkAdmin, (req, res) => {
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
        console.log(product.image.url)
        res.render('layouts/tech/show', { product})
    }
}))

//Post product data
router.post('/:category', checkCategory, ensureLogin, checkAdmin, upload.single('image'), async (req, res) => {
    const {price, productQuantity, name, description} = req.body;
    const { category } = req.params;
    if(price===''){
        req.flash('pay','Please enter a product price');
        return res.redirect(`/techroom/${category}/new`);
    }
    if(productQuantity===''){
        req.flash('pay','Please enter a quantity');
        return res.redirect(`/techroom/${category}/new`);
    }
    if(name===''){
        req.flash('pay','Please enter a name for the product');
        return res.redirect(`/techroom/${category}/new`);
    }
    if(description===''){
        req.flash('pay','Please enter a description for the product');
        return res.redirect(`/techroom/${category}/new`);
    }
    const product = new Product(req.body);
    product.category = category;
    product.image.url = req.file.path;
    product.image.filename = req.file.filename;
    await product.save();
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