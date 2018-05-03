const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

//Load user Model
require('../models/Users');
const User = mongoose.model('users');

//load Roll model
require('../models/Roll');
const Roll = mongoose.model('rolls');

// bodyParser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//saved rolls page
router.get('/saved', ensureAuthenticated, (req, res) => {
   var hideCreateButton = false;
   Roll.find({user: req.user.id})
   .sort({name:'desc'})
   .then(rolls => {
      if(rolls.length > 4){
         res.render('saved',{
            rolls: rolls,
            hideCreateButton: true
         });
      } else {
         res.render('saved', {
            rolls: rolls
         });
      }

   });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Roll.remove({_id: req.params.id})
    .then(() => {
      res.redirect('saved');
    });
});

//users login route
router.get('/login', (req, res) => {
   res.render('login');
});

//users register route
router.get('/register', (req, res) => {
   res.render('register');
});

//users add route
router.get('/add', ensureAuthenticated, (req, res) => {
   var tooManyItems = false;
   Roll.find({user: req.user.id})
   .sort({name:'desc'})
   .then(rolls => {
      if(rolls.length > 4){
         res.render('saved',{
            rolls: rolls,
            tooManyItems: true
         });
      } else {
         res.render('add');
      }
   });   
});

//register form POST
router.post('/register', (req, res) => {
   var matchError = false;
   var lengthError = false;
   var newUserSuccess = false;
   var emailError = false;

   if(req.body.password1 !== req.body.password2){
      res.render('register', {
         matchError: true,
         name: req.body.name,
         email: req.body.email,
         password1: req.body.password1,
         password2: req.body.password2
      });
   } else if(req.body.password1.length < 6) {
      res.render('register', {
         lengthError: true,
         name: req.body.name,
         email: req.body.email,
         password1: req.body.password1,
         password2: req.body.password2
      });
   } else {
      User.findOne({email: req.body.email})
         .then(user => {
            if(user){
               res.render('register', {
                  emailError: true,
                  name: req.body.name,
               });
            } else {
               const newUser = new User({
                  name: req.body.name,
                  email: req.body.email,
                  password: req.body.password1
               });
               bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if(err) throw err;
                     newUser.password = hash;
                     newUser.save()
                     .then(user => {
                        res.render('login', {
                           newUserSuccess: true
                        });
                     })
                     .catch(err => {
                        console.log(err);
                        return;
                     })
                  });
               });
            }
         });
   }




});

//Login form post
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/users/saved',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
});

//add roll form POST
router.post('/add', (req, res) => {
   var tooManyDice = false;
   if(req.body.number > 99 || req.body.damageNumber > 100) {
      res.render('add', {
         tooManyDice: true
      });

   }
   if(req.body.includeDamage) {
      var newRoll = {
         name: req.body.name,
         number: req.body.number,
         type: req.body.type,
         modifier: req.body.modifier,
         damageNumber: req.body.damageNumber,
         damageType: req.body.damageType,
         damageModifier: req.body.damageModifier,
         user: req.user.id

      }
   } else {
      var newRoll = {
         name: req.body.name,
         number: req.body.number,
         type: req.body.type,
         modifier: req.body.modifier,
         user: req.user.id
      }
   }
   new Roll(newRoll)
   .save()
   .then(roll => {
      res.redirect('saved');
   })
});

//logout user
router.get('/logout', (req, res) => {
   var loggedOut = false;
   req.logout();
   res.render('login', {
      loggedOut: true,
      user: null
   });
});

module.exports = router;
