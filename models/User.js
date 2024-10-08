
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    firstName: {
        type: String, 
        required: [true, "Firstname is required"]
    }, 
    lastName: {
        type: String, 
        required: [true, "Lastname is required"]
    },
    email: {
        type: String, 
        required: [true, "Email is required"]
    }, 
    password: {
        type: String, 
        required: [true, "Password is required"]
    },
    isAdmin: {
        type: Boolean, 
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, "MobileNumber is required"]
    }

}) 

module.exports = mongoose.model('User', userSchema);