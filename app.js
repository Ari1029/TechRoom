const express = require('express');
const app = express();
const allProducts = require('./routes/allProducts');
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://127.0.0.1:27017/techroom', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

//from documentation
const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error: "));
db.once('open',()=>{
    console.log('Connected successfully');
});

app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs',ejsMate)
app.set('view engine','ejs')

app.use('/techroom',allProducts);

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