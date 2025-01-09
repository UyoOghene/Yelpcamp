const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync')
router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async (req,res) => {
    const {email, username, password} = req.body;
    const user = new User({email,username})
    const registeredUser = await User.register(user, password)
    console.log(registeredUser);
    req.flash('success','welcome to yelpcamp');
    res.redirect('/campgrounds')
}));
module.exports = router;