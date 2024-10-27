
const mongoose = require("mongoose")

const productSchema = mongoose.Schema({

    name: {
        type: String, 
        required: [true, "Product name is required"]
    }, 
    description: {
        type: String, 
        required: [true, "Description is required"]
    },
    price: {
        type: Number, 
        required: [true, "Price is required"]
    }, 
    isActive: {
        type: Boolean, 
        default: true
    },
    images: [
        {
            imagePath: {
                type: String,
                default: 'none'
            },
            imageName: {
                type: String,
                default: 'none'
            }  
        }
    ],
    createdOn: {
        type: Date,
        default: Date.now
    } 

}) 

module.exports = mongoose.model('Product', productSchema);