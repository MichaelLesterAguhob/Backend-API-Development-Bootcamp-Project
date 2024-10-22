
const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({

    userId: {
        type: String, 
        required: [true, "UserID is required"]
    }, 

    cartItems: [ 
        {
            productId:{
                type: String, 
                required: [true, "ProdcutID is required"]
            },
            quantity:{
                type: Number, 
                required: [true, "Quantity is required"]
            },
            subtotal:{
                type: Number, 
                required: [true, "Subtotal is required"]
            }
        }
    ],
    totalPrice: {
        type: Number, 
        required: [true, "TotalPrice is required"]
    }, 
    orderedOn: {
        type: Date,
        default: Date.now
    } 

}) 

module.exports = mongoose.model('Cart', cartSchema);