const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select('name price category imgUrl stock')
    .exec()
    .then((products) => {
      res.status(200).json({
        status: 200,
        products,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};

exports.search_products = (req, res, next) => {
  const { query } = req;
  const itemName = query.item;
  Product.find({ name: new RegExp(itemName, 'i') })
    .exec()
    .then((products) => {
      res.status(200).json({
        status: 200,
        products,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};

exports.get_product = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: 404,
          message: `Product #${productId} not found`,
        });
      } else {
        res.status(200).json({
          status: 200,
          product,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};

exports.create_product = (req, res, next) => {
  const { name, price, category, imgUrl, stock } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    category,
    imgUrl,
    stock,
  });
  product
    .save()
    .then(() => {
      res.status(201).json({
        status: 201,
        message: `Product '${product.name}' created!`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};

exports.edit_product = (req, res, next) => {
  const { productId } = req.params;
  Product.updateOne({ _id: productId }, { $set: req.body })
    .exec()
    .then(() => {
      Product.findById(productId, (err, product) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 500,
            error: err,
          });
        } else {
          res.status(200).json({
            status: 200,
            message: `Product #${productId} updated!`,
            product,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};

exports.delete_product = (req, res, next) => {
  const { productId } = req.params;
  Product.remove({ _id: productId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        status: 200,
        message: `Product #${productId} deleted.`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};
