const express = require('express');
const app = express();
const allProducts = require('./routes/allProducts');
const cart = require('./routes/cart');
const userPaths = require('./routes/users');
const mongoose = require('mongoose');
const User =require('./models/User');
const path = require('path');
const ejsMate = require('ejs-mate')
const passport = require('passport');
const passportStrategy = require('passport-local');
const override = require('method-override');
const expressSesssion = require('express-session');
const Strategy = require('passport-local');

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

app.use(passport.session())
app.use(passport.initialize())
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    next();
})

//routes
app.use('/techroom',cart)
app.use('/techroom',userPaths);
app.use('/techroom',allProducts);

app.listen(8080,()=>{
    console.log('success on port 8080')
})