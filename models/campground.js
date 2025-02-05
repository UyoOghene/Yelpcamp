const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
    title: String,
    location: String,
    image: String,
    price: Number,
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    description: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});
module.exports = mongoose.model('Campground', campgroundSchema);
