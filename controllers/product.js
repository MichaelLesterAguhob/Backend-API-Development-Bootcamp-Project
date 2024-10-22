
const Product = require('../models/Product')

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
        // if (result.length > 0) {
             res.status(200).send( result );
        // } else {
        //      res.status(404).send({ message: "No product found" });
        // }
    }).catch(err => errorHandler(err, req, res));
}


module.exports.getAllActiveProducts = (req, res) => {
    Product.find({ isActive: true }).then(result => {
        if (result.length > 0) {
             res.status(200).send( result );
        } else {
             res.status(404).send({ message: "No active product found" });
        }
    }).catch(err => errorHandler(err, req, res));
}


module.exports.getSpecificProduct = (req, res) => {
    Product.findById(req.params.id).then(result => {
        if(result) {
             res.status(200).send(result);
        } else {
             res.status(404).send({message: "Product not found"})
        }
    }).catch(err => errorHandler(err, req, res));
}


module.exports.updateProductInfo = (req, res) => {
    const  id  = req.params.id;

    return Product.findByIdAndUpdate(
        id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        },
        {new :true}
    ).then(result => {
            if(result){
                res.status(200).send({ success: true, message: 'Product updated successfully'});
            } else {
                res.status(404).send({ error: 'Product not found'});
            }
        }
    ).catch(err => errorHandler(err, req, res));
}


module.exports.archiveProduct = (req, res) => {
    const  id  = req.params.id;

    return Product.findById(id).then(result => {
            if(!result){
                return res.status(404).send({ error: 'Product not found'});
            } else if(!result.isActive) {
                return res.status(200).send({ 
                    message: 'Product already archived', 
                    archivedProduct: result
                });
            }

            result.isActive = false;
            return result.save().then(() => {
                res.status(200).send({ 
                    success: true, 
                    message: 'Product archived successfully'
                })
            })
    }).catch(err => errorHandler(err, req, res));
}


module.exports.activateProduct = (req, res) => {
    const  id  = req.params.id;

    return Product.findById(id).then(result => {
            if(!result){
                return res.status(404).send({ error: 'Product not found'});
            } else if(result.isActive) {
                return res.status(200).send({ 
                    message: 'Product already active', 
                    archivedProduct: result
                });
            }

            result.isActive = true;
            return result.save().then(() => {
                res.status(200).send({ 
                    success: true, 
                    message: 'Product activated successfully'
                })
            })
    }).catch(err => errorHandler(err, req, res));
}


module.exports.searchProductByName = (req, res) => {
    const regex = new RegExp(req.body.name, "i");
    
    Product.find({name: regex}).then(result => {
        if(result) {
             res.status(200).send(result);
        } else {
             res.status(404).send({message: "Product not found"})
        }
    }).catch(err => errorHandler(err, req, res));
}


module.exports.searchProductByPrice = (req, res) => {
    Product.find(
        {
            price: { $gte: req.body.minPrice, $lte: req.body.maxPrice }
        })
        .then(result => {
            if(result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({message: "Product not found"})
            }
        }).catch(err => errorHandler(err, req, res));
}


