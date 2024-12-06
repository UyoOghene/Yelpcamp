const  mongoose  = require("mongoose");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const userSchema = new mongoose.Schema({
    username: String,
    age: Number
})

const User = mongoose.model('User', userSchema);



const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: {type: mongoose.Schema.Types.ObjectId, ref: User}
})
const Tweet = mongoose.model('Tweet', tweetSchema);


// const makeTweets = async () => {
//     // const user = new User({ username: 'uyo', age: 23});
//     const user = await User.findOne({username: 'uyo'}) 
//     const tweet2 = new Tweet({ text:' I\'m struggling', likes: 40})
//     // const tweet1 = new Tweet({ text:' I hope i dont fail', likes: 0})
//     tweet2.user = user;
//     user.save();
//     tweet2.save();
// } 
// makeTweets();


const findTweet = async ()=> {
   const t = await Tweet.find({}).populate('user')
   console.log(t)
}

findTweet();