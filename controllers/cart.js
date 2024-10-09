
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const {errorHandler} = require("../auth");


module.exports.getCart = async (req, res) => {
    const id = req.user.id;
    const isUserAdmin = User.findById(id);
    if(isUserAdmin.isAdmin === false) {
        Cart.find({userId: id}).then(cart => {
            if(!cart) {
                res.status(404).send({message: "No cart found!"})
            } else {
                res.status(200).send({cart});
            }
        }).catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({message: "Admin is forbidden"});
    }
};


module.exports.addToCart = async (req, res) => {
    const userId = req.user.id; 

    const isUserAdmin = User.findById(userId);
    if(isUserAdmin.isAdmin === false) {

        const { productId, quantity, subtotal } = req.body;

        if (!productId || !quantity || !subtotal) {
            return res.status(400).send({ message: "ProductId, quantity, and subtotal are required." });
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                cartItems: [],
                totalPrice: 0
            });
        }

        const isItemExists = cart.cartItems.find(item => item.productId === productId);

        if (isItemExists) {
            isItemExists.quantity += quantity;
            isItemExists.subtotal += subtotal; 
        } else {
            cart.cartItems.push({ productId, quantity, subtotal });
        }
        
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0)

        await cart.save().then(cart => {
            res.status(200).send({ message: "Item added to cart successfully", cart })
        }).catch(err => errorHandler(err, req,res));
    } else {
        return res.status(400).send({message: "Admin is forbidden"});
    }
};


module.exports.updateCartQuantity = async (req, res) => {
    const id = req.user.id;

    const isUserAdmin = User.findById(id);
    if(isUserAdmin.isAdmin === false) {
        const {productId, newQuantity} = req.body;

        const cart = await Cart.findOne({userId: id});
        if(!cart) {
            return res.status(400).send({message: "Cart is empty"});
        }

        let isItemExists = cart.cartItems.find(item => item.productId === productId); 

        if(isItemExists) {
            const product = await Product.findOne({_id: productId});
            let price = product.price;
            isItemExists.quantity = newQuantity;
            isItemExists.subtotal = newQuantity * price;
        } else {
            return res.status(400).send({message: "Item not found in cart"});
        }

        cart.totalPrice = cart.cartItems.reduce((total, item) => item.subtotal + total, 0)

        await cart.save().then(cart => {
            res.status(200).send({ message: "Item quantity updated successfully", cart })
        }).catch(err => errorHandler(err, req,res));
    } else {
        return res.status(400).send({message: "Admin is forbidden"});
    }
};