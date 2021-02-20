const moment = require('moment');
const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Receipt = require('../models/receipt');
const Product = require('../models/product');

exports.get_all_carts = (req, res, next) => {
  Cart.find()
    .select('userId items')
    .exec()
    .then((carts) => {
      res.status(200).json({
        status: 200,
        carts,
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

exports.checkout_cart = (req, res, next) => {
  const { customerId, paymentMethod, cart } = req.body;

  // Calculate receipt totals
  cart.items = cart.items.map((item) => {
    const itemTotalCost = item.product.price * item.quantity;
    return {
      ...item,
      itemTotalCost,
    };
  });
  const totalCost = cart.items.reduce((total, item) => {
    const newTotal = total + item.itemTotalCost;
    return newTotal;
  }, 0);

  const receipt = new Receipt({
    _id: mongoose.Types.ObjectId(),
    timestamp: moment(),
    customer: customerId,
    items: cart.items,
    totalCost,
    totalPaid: totalCost,
    paymentMethod,
  });
  receipt
    .save()
    .then(() => {
      // If receipt creation successful, delete the user's cart
      Cart.findByIdAndDelete(cart._id)
        .exec()
        .then(() => {
          // Deduct stock count from relvant products
          cart.items.forEach((item) => {
            Product.updateOne(
              { _id: item.product._id },
              {
                $set: {
                  stock: item.product.stock - item.quantity,
                },
              }
            )
              .exec()
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  status: 500,
                  ...err,
                });
              });
          });
          res.status(201).json({
            status: 201,
            message: `Sucessfully completed checkout for cart #${cart._id}`,
            receipt,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            status: 500,
            ...err,
          });
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

exports.delete_cart = (req, res, next) => {
  const { cartId } = req.params;
  Cart.remove({ _id: cartId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        status: 200,
        message: `Cart #${cartId} deleted.`,
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
