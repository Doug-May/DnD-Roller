const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Load routes
const users = require('./routes/users.js');
const static = require('./routes/static.js');

//Passport Config
require('./config/passport')(passport);

// connect to mongoose
mongoose.connect('mongodb://doug:doug@ds163769.mlab.com:63769/dndroller')
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// handlebars templating middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// /access to public folder for static assets
app.use(express.static('public'));

// Method override middleware
app.use(methodOverride('_method'));

// /middleware for express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables here
app.use(function(req, res, next){
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});

// Use routes
app.use('/users', users);
app.use('/', static);
app.use('/', static);

// initiate the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log(`server started on port ${port}`);
});
