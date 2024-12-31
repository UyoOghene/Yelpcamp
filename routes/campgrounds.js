const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');
const methodOverride = require('method-override'); 
const { campgroundSchema } = require('../schemas');


const validateCampgroundJoi = (req,res, next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required()
        }).required()
    });

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new expressError(msg, 400);
    }else{
        next();
    }
}


router.get('/',catchAsync( async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index.ejs', {campgrounds} )
}))

router.get('/new', (req,res) => {
    res.render('./campgrounds/new.ejs' )
})

router.post('/', validateCampgroundJoi, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        throw new expressError('Campground not found', 404);
    }
    res.render('./campgrounds/show', { campground });
}));

// router.get('/campgrounds/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).send("Invalid Campground ID");
//         }
//         const campground = await Campground.findById(id);
//         if (!campground) {
//             return res.status(404).send("Campground not found");
//         }
//         res.render('./campgrounds/show.ejs', { campground });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send("Something went wrong");
//     }
// });

router.get('/:id/edit',catchAsync (async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit.ejs', {campground} )
}))

router.put('/:id',catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
 }));

 router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
 })

 module.exports =router;