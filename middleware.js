
module.exports.isLoggedIn = (req,res,next)=>{
    // console.log('request.user:', req.user)
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next()
}

