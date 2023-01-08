const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const promiseWrapper = require('../utilities/promiseWrapper');
const passport = require('passport');

//ADMIN: VIEW ALL CURRENT ORDERS
router.get('/',promiseWrapper(async(req,res)=>{
    //if req.user is an admin, then run the below code
    // const displayUsers = await User.find({permission: false}).populate({
    //     path: 'orders',
    // })
    // res.render('layouts/admin/index',{displayUsers})

    //otherwie, res.render the home landing page
    res.render('layouts/home');
}))

router.get('/signup',(req,res)=>{
    res.render('layouts/user/signup');
})

router.post('/signup',promiseWrapper(async (req,res)=>{
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
    let user = new User({email, username});
    if(email.includes('admin')){
        user.permission = true;
    }
    else user.permission = false;
    user = await User.register(user,password);
    res.redirect('/techroom')
}))

router.get('/login',promiseWrapper(async (req,res)=>{
    res.render('layouts/user/login')
}))

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),(req,res)=>{
    res.redirect('/techroom')
})

module.exports = router;