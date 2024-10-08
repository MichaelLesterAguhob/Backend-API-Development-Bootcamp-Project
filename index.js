const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');

const app = express();

require('dotenv').config();

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to Database'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);




if(require.main === module) {
	app.listen(process.env.PORT, () => console.log(`API is now online on port ${process.env.PORT}`));
};
module.exports = {app, mongoose};