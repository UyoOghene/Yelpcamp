const ExpressError = require('./utilities/expressError.js');
const { campgroundSchema } = require('./schemas.js');
const Campground = require('./models/campground.js');
const { reviewSchema } = require('./schemas.js');


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

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

 module.exports.isAuthor = async(req,res,next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'Not authorised!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


