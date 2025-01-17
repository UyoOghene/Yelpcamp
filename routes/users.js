const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
router.get('/register', (req,res)=>{
    res.render('users/register')
})

// router.post('/register', catchAsync(async (req,res) => {
//     try {
//     const {email, username, password} = req.body;
//     const user = new User({email,username})
//     const registeredUser = await User.register(user, password)
//     console.log(registeredUser);
//     req.flash('success','welcome to yelpcamp');
//     res.redirect('/campgrounds')
//     }catch(e){
//         req.flash('error', e.message);
//         res.redirect('/register');
//     }
// }));

router.get('/login', (req,res)=>{
    res.render('users/login')
})

// router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}, (req,res)=>{
//     req.flash('success', 'welcome to yelpcamp');
//     res.redirect('/campgrounds');
// }));
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', 'Welcome back to YelpCamp!');
    res.redirect('/campgrounds');
});


module.exports = router;