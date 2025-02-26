const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.get("/get/all/product/api", productController.listProduct);
router.get(
  "/get/specific/product/api/:id",
  productController.listSpecificProduct
);
module.exports = router;
