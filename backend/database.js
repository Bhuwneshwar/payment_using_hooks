var mongoose = require("mongoose");
require("dotenv").config();
exports.connectMongoose = function () {
    mongoose
        .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    })
        .then(function (data) {
        console.log("Mongodb connected with server: ".concat(data.connection.host));
    })
        .catch(function (e) {
        console.log("No Internet connection \n", e);
        //require("../ErrorsStore").errorsStore(e, "at connectDatabase");
    });
};
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    name: String,
});
exports.User = mongoose.model("User", UserSchema);
