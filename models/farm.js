const  mongoose  = require("mongoose");
// const schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const productSchema = new mongoose.Schema({ 
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['winter', 'summer', 'fall'] 
    }
});
const farmSchema = new mongoose.Schema({
    name: String,
    city: String,
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]

})


const Product = mongoose.model('Product', productSchema); // Capitalize model name
const Farm = mongoose.model('Farm', farmSchema);

// Product.insertMany([
//     { name: 'sugarbaby watermelon', price: 344, season: 'winter' },
//     { name: 'spring onion', price: 44, season: 'summer' },
//     { name: 'sugarless cucumber', price: 24, season: 'fall' } // Fixed 'spring' to 'fall'
// ]).then(() => {
//     console.log("Products inserted");
//     mongoose.connection.close(); // Close connection after insertion
// }).catch(err => {
//     console.error(err);
// });


const makefarm = async()=>{
    const farm = new Farm({name: 'full belly farm', city: 'kubwa'});
    const melon = await Product.findOne({name:'sugarbaby watermelon'});
    farm.products.push(melon);
    await farm.save();
    console.log(farm);
}

makefarm();

const addproduct = async ()=> {
    const farm = await Farm.findOne({name: 'full belly farm'})
    const onion = await Product.findOne({ name: 'spring onion'})
    farm.products.push(onion);
    await farm.save();
}

addproduct();

Farm.findOne({name: 'full belly farm'})
    .populate('products')
    .then(farm=>console.log(farm))
