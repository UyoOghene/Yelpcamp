const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

const catchAsync = require('../utilities/catchAsync');

router.get('/register',users.renderRegister);

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

router.get('/login', users.renderLogin);

// router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}, (req,res)=>{
//     req.flash('success', 'welcome to yelpcamp');
//     res.redirect('/campgrounds');
// }));
router.post('/register', catchAsync(users.register));

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), users.login);

router.get('/logout',users.logout); 





module.exports = router;