const express = require('express');
const app = express();
const allProducts = require('./routes/allProducts');
const orders = require('./routes/orders')
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate')
const passport = require('passport');
const passportStrategy = require('passport-local');
const override = require('method-override');
const expressSesssion = require('express-session');

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
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs',ejsMate)
app.set('view engine','ejs')

//configuring session, will soon include secure session store with mongo
app.use(expressSesssion({
    cookie:{
        expires: Date.now() + 1000*60*60*24,
        maxAge: 1000*60*60*24
    },
    secret: 'private secret',
    resave: false,
    saveUninitialized: true
}))

//routes
app.use('/techroom',allProducts);
app.use('/techroom',orders)

app.all('*',(req,res,next)=>{
    next(new Error);
})

app.use((err,req,res,next)=>{
    err.message = 'Could not load that page'
    res.render('404')
})

app.listen(8080,()=>{
    console.log('success on port 8080')
})