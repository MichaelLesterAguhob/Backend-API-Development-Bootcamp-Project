
const Product = require('../models/Product')
const auth = require("../auth");
const {errorHandler} = require("../auth");

module.exports.createProduct = (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    Product.findOne({name: req.body.name}).then(isExisting => {
        if(isExisting) {
            return res.status(409).send({message: 'Product already exists'})
        }

        return newProduct.save().then(result => res.status(201).send({
            success: true,
            message: 'Product Added Successfully',
            result
        }))
    }).catch(err => errorHandler(err, req, res));
}


module.exports.getAllProducts = (req, res) => {
    Product.find({}).then(result => {
        if(result.length <= 0) {
            return res.status(404).send({message: "No product found!"})
        }
        return res.status(200).send({result});
    }).catch(err => errorHandler(err, req, res));
}


module.exports.getAllActiveProducts = (req, res) => {
    Product.find({isActive: true}).then(result => {
        if(result.length <= 0) {
            return res.status(404).send({message: "No active product found!"})
        }
        return res.status(200).send({result});
    }).catch(err => errorHandler(err, req, res));
}


module.exports.getSpecificProduct = (req, res) => {
    Product.findById(req.params.id).then(result => {
        if(!result) {
            return res.status(404).send({message: "Product not found!"})
        }
        return res.status(200).send({result});
    }).catch(err => errorHandler(err, req, res));
}


module.exports.updateProductInfo = (req, res) => {
    const  id  = req.params.id;

    return Product.findByIdAndUpdate(
        id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
    ).then(result => {
            if(result){
                res.status(200).send({ success: true, message: 'Product updated successfully'});
            } else {
                res.status(404).send({ message: 'Product not found'});
            }
        }
    ).catch(err => errorHandler(err, req, res));
}


module.exports.archiveProduct = (req, res) => {
    const  id  = req.params.id;

    return Product.findByIdAndUpdate(id, {isActive: false}).then(result => {
            if(!result){
                return res.status(404).send({ error: 'Product not found'});
            } else if(!result.isActive) {
                return res.status(200).send({ 
                    message: 'Product already archived', 
                    archivedProduct: result
                });
            }

            return res.status(200).send({ 
                success: true, 
                message: 'Product archived successfully'
            });
        }
    ).catch(err => errorHandler(err, req, res));
}


module.exports.activateProduct = (req, res) => {
    const  id  = req.params.id;

    return Product.findByIdAndUpdate(id, {isActive: true}).then(result => {
            if(!result){
                return res.status(404).send({ error: 'Product not found'});
            } else if(result.isActive) {
                return res.status(200).send({ 
                    message: 'Product already active', 
                    archivedProduct: result
                });
            }

            return res.status(200).send({ 
                success: true, 
                message: 'Product activated successfully'
            });
        }
    ).catch(err => errorHandler(err, req, res));
}




