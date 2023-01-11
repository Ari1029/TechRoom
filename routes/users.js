const router = require('express').Router();
const User = require('../models/User');
const Product = require('../models/Product');
const promiseWrapper = require('../utilities/promiseWrapper');
const passport = require('passport');
const { ensureLogin } = require('../middleware');

function getMin(array){
    const priceArray = array.map((i)=>{
        return i.price;
    })
    const min = Math.min(...priceArray);
    return min;
}

//ADMIN: VIEW ALL CURRENT ORDERS
router.get('/', promiseWrapper(async(req,res)=>{ 

    const laptops = await Product.find({category: 'laptops'});
    const lmin = getMin(laptops);
    const laptop = await Product.findOne({price: lmin}).populate('image')
    
    const tablets = await Product.find({category: 'tablets'});
    const tmin = getMin(tablets)
    const tablet = await Product.findOne({price: tmin}).populate('image')

    const phones = await Product.find({category: 'phones'});
    const pmin = getMin(phones)
    const phone = await Product.findOne({price: pmin}).populate('image')

    const accessories = await Product.find({category: 'accessories'});
    const amin = getMin(accessories)
    const accessory = await Product.findOne({price: amin}).populate('image')


    res.render('layouts/home',{laptop, tablet, phone,accessory, lmin, tmin, pmin, amin});
}))

router.get('/signup',(req,res)=>{
    res.render('layouts/user/signup');
})

//using postman's logout
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('pay','Successfully logged out')
        res.redirect('/techroom');
      });
})

router.post('/signup',promiseWrapper(async (req,res,next)=>{
    const {email, username, password} = req.body;
    const emailTest = await User.find({email: email});
    const usernameTest = await User.find({username: username})
    if(emailTest.email){
        //instead of redirecting, use a flash to say this message
        const message = 'A user with that email already exists'
        return res.render('404',{message});
    }
    if(usernameTest.email){
        //instead of redirecting, use a flash to say this message
        const message = 'An account with that username already exists'
        return res.render('404',{message});
    }
    const user = new User({email, username});
    if(email.includes('admin')){
        user.permission = true;
    }
    else user.permission = false;
    const authUser = await User.register(user,password);
    req.login(authUser,err=>{
        if(err) return next(err);
        else {
            req.flash('success',`Welcome to TechRoom, ${username}`);
            res.redirect('/techroom')
        }
    })
}))

router.get('/login',promiseWrapper(async (req,res)=>{
    res.render('layouts/user/login')
}))

//using postman login middleware authenticate
router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/techroom/login'}),async(req,res)=>{
    const username = req.body.username;
    const user = await User.findOne({username: username});
    req.flash('success',`Welcome back, ${username}`);
    return res.redirect('/techroom');
})

module.exports = router;