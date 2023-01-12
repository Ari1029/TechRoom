const express = require('express');
const app = express();
const allProducts = require('./routes/allProducts');
const cart = require('./routes/cart');
const admin = require('./routes/admin')
const userPaths = require('./routes/users');
const mongoose = require('mongoose');
const User =require('./models/User');
const ejsMate = require('ejs-mate')
const passport = require('passport');
const override = require('method-override');
const expressSesssion = require('express-session');
const Strategy = require('passport-local');
const promiseWrapper = require('./utilities/promiseWrapper');
const {ensureLogin} = require('./middleware');
const Order =require('./models/Order');
const flash = require('connect-flash');
const { postcodeValidator} = require('postcode-validator');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
    }    

app.use(express.static(__dirname + '/public'));

// app.request(express.json())
const stripe = require('stripe')(process.env.STRIPE_KEY)
app.use(express.json())

//connecting to database
mongoose.connect('mongodb://127.0.0.1:27017/techroom', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error: "));
db.once('open',()=>{
    console.log('Connected successfully');
});

//configuring view engine and more configuration
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.use(express.urlencoded({extneded: true}))

//configuring session, will soon include secure session store with mongo
app.use(expressSesssion({
    cookie:{
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    },
    resave: false,
    secret: 'private secret',
    saveUninitialized: true
}))
app.use(flash());

app.use(passport.session())
app.use(passport.initialize())
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.pay = req.flash('pay');
    next();
})

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    next();
})

app.use(override('add'));

//Stripe payment gateway route + order creation and user product removal.
app.post('/techroom/create-session',ensureLogin, promiseWrapper(async(req,res)=>{
    const id = req.user._id;
    const {country, postalCode, city, streetAddress} = req.body;
    if(streetAddress===''){
        req.flash('pay','Please enter you street address');
        return res.redirect('/techroom/cart/order');
    }
    else if(!city){
        req.flash('pay','Please enter your city');
        return res.redirect('/techroom/cart/order');
    }
    else if(!postalCode){
        req.flash('pay','Please enter your postal code');
        return res.redirect('/techroom/cart/order');
    }
    else if(!country){
        req.flash('pay','Please enter your country');
        return res.redirect('/techroom/cart/order');
    }
    else if(postcodeValidator(postalCode, 'CA')===false){
        req.flash('pay','Please enter a valid postal code to ship you to');
        return res.redirect('/techroom/cart/order');
    }
    else{
    const user = await User.findById(id).populate('products');
    const order = new Order;
    order.user = user;
    order.streetAddress = streetAddress;
    order.country = country;
    order.city=city;
    order.postalCode = postalCode;
    order.status = 'Pending';
    const date = Date.now();
    order.date = parseInt(date);
    let i=0;
    for(let product of user.products){
        product.helper = 0;
        i+=product.price;
        order.products.push(product);
    }
    i = (i*1.13).toFixed(2);
    order.totalPrice = i;
    console.log(i);
    await order.save();

    const tot = Math.round(i*100);
    let name = `${order.user.username}'s TechRoom Order`;
    name = name.toUpperCase();
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'cad',
                    product_data: {
                        name: name
                    },
                    unit_amount: tot,
                },
                quantity: 1,
            }
        ],
        mode:'payment',
        success_url: `${process.env.URL}/techroom/orderSuccess`,
        cancel_url: `${process.env.URL}/techroom/orderFailed`
    })
    res.redirect(`${session.url}`);
    }
}
))

app.use('/techroom',admin);
app.use('/techroom',cart)
app.use('/techroom',userPaths);
app.use('/techroom',allProducts);

app.listen(8080,()=>{
    console.log('success on port 8080')
})