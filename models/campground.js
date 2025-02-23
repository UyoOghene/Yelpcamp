const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
    title: String,
    location: String,
    images: {
       url: String,
       filename: String 
    },
    price: Number,
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    description: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});
module.exports = mongoose.model('Campground', campgroundSchema);
