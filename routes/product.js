const express = require('express');

const userController = require("../controllers/user");
const productController = require("../controllers/product");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProducts);
router.get("/active", productController.getAllActiveProducts);
router.get("/:id", productController.getSpecificProduct);

router.patch("/:id/update", verify, verifyAdmin, productController.updateProductInfo);
router.patch("/:id/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:id/activate", verify, verifyAdmin, productController.activateProduct);


module.exports = router;