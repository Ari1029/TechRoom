const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const promiseWrapper = require('../utilities/promiseWrapper');

//ADMIN: VIEW ALL CURRENT ORDERS
router.get('/',promiseWrapper(async(req,res)=>{
    const displayUsers = await User.find({permission: false}).populate({
        path: 'orders',
        populate: {
            path: _id
        }
    })
    res.render('/layouts/admin/index',{displayUsers})
}))

router.get('/signup',(req,res)=>{
    res.render('/layouts/user/signup');
})

router.post('/signup',promiseWrapper(async (req,res)=>{

}))

router.post('/register',promiseWrapper)