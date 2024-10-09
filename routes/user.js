const express = require('express');
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/login", userController.loginUser);
router.get("/details", verify, userController.getUserDetails);
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setUserAsAdmin);
router.patch("/update-password", verify, userController.changePassword);


module.exports = router;