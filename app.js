require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/Database');
const flash = require('connect-flash');
const session = require('express-session');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(methodOverride('_method'))

// Database
connectDB();

// Static Files
app.use(express.static('public'));

// Session
app.use(
    session({
        secret : 'secret',
        resave : false,
        saveUninitialized : true,
        cookie : {
            maxAge : 1000 * 60 * 60 * 24 * 7 // 1 Week
        }
    })
)

// Flash Message
app.use(flash());

// Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/custromer'));

// Handle 404
app.get('*', (Req, res) => {
    res.status(404).render('404');
})

app.listen(PORT, ()=>{
    console.log(`Server listening on PORT : ${PORT}`);
})