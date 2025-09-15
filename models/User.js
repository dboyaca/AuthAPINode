//Creating our model that maps exactly that maps exactly to the one in the DB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password : {
        type: String,
        required: true
    },
    createdAt : {
        type : Date,
        required: true,
        default : Date.now
    }
});

//That is the name how it will be mapped into the MongoDB collection
const User = mongoose.model("User", UserSchema); 

module.exports = User;