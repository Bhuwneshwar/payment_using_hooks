const mongoose = require("mongoose");
require("dotenv").config();
exports.connectMongoose = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
      console.log("No Internet connection \n", e);
      //require("../ErrorsStore").errorsStore(e, "at connectDatabase");
    });
};
const UserSchema = new mongoose.Schema({
  username:{
    type :String, 
    required :true, 
    unique :true 
  }, 
  password:String, 
  name:String 
})

exports.User=mongoose.model("User",UserSchema)