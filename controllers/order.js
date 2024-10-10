const Order = require('../models/Order');
const Cart = require('../models/Cart');
const {errorHandler} = require("../auth");


module.exports.createOrder = async (req, res) => {
    const userId = req.user.id;

    const userCart = await Cart.findOne({userId});    
    if(!userCart) {
        return res.status(404).send({message: "No cart found"})
    }
    
    if(userCart.cartItems.length <= 0) {
        return res.status(400).send({message: "No items to checkout"})
    }

    const productOrdered = userCart.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal
    }))

    const newOrder = new Order({
        userId: userId,
        productOrdered,
        totalPrice: userCart.totalPrice
    })

    await newOrder.save().then((order) => {
        if(order) {
            res.status(200).send({message: "Ordered Successfully"});
            userCart.cartItems = [];
            userCart.totalPrice = 0;
            userCart.save();
        } 

    }).catch(err => errorHandler(err, req, res));
}


module.exports.getOrders = async (req, res) => {
    const userId = req.user.id;

   await Order.find({userId}).then(orders => {
        if(orders.length <= 0) {
            return res.status(404).send({message: "No orders found"})
        } else {
            return res.status(200).send({orders: orders})
        }
   }).catch(err => errorHandler(err, req, res));
}



module.exports.getAllUsersOrder = async (req, res) => {

    await Order.find({}).then(userOrders => {
        if(userOrders.length <= 0) {
            return res.status(404).send({message: "No orders found"})
        } else {
            return res.status(200).send({orders: userOrders})
        }
    }).catch(err => errorHandler(err, req, res));

}

