const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedhelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author : '67a3a99235b16758d666ad40',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'molestiae deserunt!',
            // image: `https://picsum.photos/400?random=${Math.random()}`, // Generate new URL for each campground
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dk0e6pgpj/image/upload/v1740385344/YelpCamp/meuaey9oenxrolvkuyrg.jpg',
                  filename: 'YelpCamp/meuaey9oenxrolvkuyrg',
                },
                {
                  url: 'https://res.cloudinary.com/dk0e6pgpj/image/upload/v1740385344/YelpCamp/wim2pozettusfzqbauef.jpg',
                  filename: 'YelpCamp/wim2pozettusfzqbauef',
                },
                {
                  url: 'https://res.cloudinary.com/dk0e6pgpj/image/upload/v1740385345/YelpCamp/nglnsz055hnjkj8qjb3z.png',
                  filename: 'YelpCamp/nglnsz055hnjkj8qjb3z',
                }
              ],
        });
        await camp.save();
    }
};
seedDB().then(() =>{
    mongoose.connection.close();
});