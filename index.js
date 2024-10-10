const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express();

require('dotenv').config();

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to Database'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);




if(require.main === module) {
	app.listen(process.env.PORT, () => console.log(`API is now online on port ${process.env.PORT}`));
};
module.exports = {app, mongoose};