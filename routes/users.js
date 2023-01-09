const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const promiseWrapper = require('../utilities/promiseWrapper');
const passport = require('passport');
const { ensureLogin } = require('../middleware');


//ADMIN: VIEW ALL CURRENT ORDERS
router.get('/', promiseWrapper(async(req,res)=>{ //home page will be different for user and admin
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

//using postman's logout
router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        // req.flash('success','Successfully logged out')
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
        else res.redirect('/techroom')
    })
}))

router.get('/login',promiseWrapper(async (req,res)=>{
    res.render('layouts/user/login')
}))

//using postman login middleware authenticate
router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),async(req,res)=>{
    const username = req.body.username;
    const user = await User.findOne({username: username});
        return res.redirect('/techroom');
})

module.exports = router;