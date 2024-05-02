// const mongoose  = require("mongoose");


// mongoose.connect("mongodb://127.0.0.1:27017/pin")

// const postSchema =  mongoose.Schema({
//   user:{
//     ref:"user"
//   },
//   title: String,
//   description: String, 
//   image: String, 
// });

// module.exports = mongoose.model("post", postSchema);

const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user" // This should match the model name of your user schema
  },
  title: String,
  description: String,
  image: String
});

module.exports = mongoose.model("Post", postSchema);