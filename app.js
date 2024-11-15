const express = require('express')
const path = require('path')
const methodOverride = require('method-override'); 
const mongoose = require('mongoose');
const Campground = require('./models/campground')

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


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))

app.get('/', (req,res) => {
    res.send('hello from yelpcamp')
})

app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('./campgrounds/index.ejs', {campgrounds} )
})
app.get('/campgrounds/new', (req,res) => {
    res.render('./campgrounds/new.ejs' )
})
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/show.ejs', {campground} )
})

app.get('/campgrounds/:id/edit', async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('./campgrounds/edit.ejs', {campground} )
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
 });

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


app.listen(3000, () => {
    console.log('serving on port 3000')
})

