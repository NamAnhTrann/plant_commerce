const Product = require("../model/productModel");

module.exports = {
  listProduct: async function (req, res) {
    try {
      const products = await Product.find({});
      return res.status(201).json(products);
    } catch (err) {
      return res.status(404).json({ message: "Fail", err });
    }
  },
  listSpecificProduct: async function (req, res) {
    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);
      return res.status(201).json([product]);
    } catch (err) {
      return res.status(404).json({ message: "Error", err });
    }
  },
};
