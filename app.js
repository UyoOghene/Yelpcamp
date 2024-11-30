const express = require('express')
const path = require('path')
const methodOverride = require('method-override'); 
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const catchAsync = require('./utilities/catchAsync');
const expressError = require('./utilities/expressError');
const Joi = require('joi');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();   

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.send('hello from yelpcamp')
})

app.get('/campgrounds',catchAsync( async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index.ejs', {campgrounds} )
}))

app.get('/campgrounds/new', (req,res) => {
    res.render('./campgrounds/new.ejs' )
})
app.post('/campgrounds', catchAsync(async (req, res) => {
    // if (!req.body.campground ){
    //     throw new expressError('invalid campground data',400)
    // }
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            location: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required()
        }).required()
    });
    
    const { error } = campgroundSchema.validate(req.body.campground);
    if (error) {
        throw new expressError(error.details.map(el => el.message).join(', '), 400);
    }
        // console.log(campground)

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync (async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        
        throw new expressError('testing',500)
    }
    res.render('./campgrounds/show.ejs', {campground} )
}))

// app.get('/campgrounds/:id', async (req, res) => {
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

app.get('/campgrounds/:id/edit',catchAsync (async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit.ejs', {campground} )
}))

app.put('/campgrounds/:id',catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
 }));

 app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
 })
 



// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: 'My backyard', description: 'testing camp'})
//     await camp.save();
//     res.send(camp)
// })

app.all('*', (req, res, next) => {
    next(new expressError('page not found ', 404))
});

app.use((err, req , res, next)=>{
    const { statusCode = 500, message = 'something went wrong' } = err;
    console.error(err);
    if(!err.message){
        err.message = 'oh no, something went wrong'
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})

