const mongoose = require('mongoose');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.get_user_cart = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        Cart.findOne({ owner: userId })
          .select('userId items')
          .populate('owner')
          .populate({
            path: 'items',
            populate: {
              path: 'product',
              model: 'Product',
            },
          })
          .exec()
          .then((cart) => {
            if (cart) {
              res.status(200).json({
                status: 200,
                cart,
              });
            } else {
              res.status(404).json({
                status: 404,
                message: `Cart not found for user #${userId}. Create one!`,
              });
            }
          });
      } else {
        res.status(404).json({
          status: 404,
          message: `User #${userId} not found.`,
        });
      }
    });
};

exports.add_user_cart = (req, res, next) => {
  const { userId } = req.params;
  const { items } = req.body;
  // Check if userId is valid
  User.findOne({ _id: userId })
    .exec()
    .then((user) => {
      if (user) {
        // Check for existing user cart. User can only have one.
        Cart.findOne({ owner: userId })
          .exec()
          .then((cart) => {
            if (cart) {
              res.status(422).json({
                status: 422,
                message: `User #${userId} already has an existing cart.`,
              });
            } else {
              // 'Items' property must exist and contain items in the array
              if (!items || items.length === 0) {
                res.status(400).json({
                  status: 400,
                  message:
                    "'Items' array must be included in the payload, and it cannot be empty.",
                });
              } else {
                const cart = new Cart({
                  _id: mongoose.Types.ObjectId(),
                  owner: userId,
                  items: items.map((item) => ({
                    quantity: item.quantity,
                    product: item.productId,
                  })),
                });
                cart
                  .save()
                  .then((result) => {
                    console.log(result);
                    res.status(201).json({
                      status: 201,
                      cart,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      status: 500,
                      ...err,
                    });
                  });
              }
            }
          });
      } else {
        res.status(404).json({
          status: 404,
          message: `User #${userId} not found.`,
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

exports.edit_user_cart = (req, res, next) => {
  const { userId, cartId } = req.params;
  const { items } = req.body;
  // Check if 'userId' is valid
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        // Check if 'cartId' is valid
        Cart.findOne({ userId })
          .exec()
          .then((cart) => {
            if (cart) {
              // 'Items' property must exist and contain items in the array
              if (!items || items.length === 0) {
                res.status(400).json({
                  status: 400,
                  message:
                    "'Items' array must be included in the payload, and it cannot be empty.",
                });
              } else {
                const cartId = cart.id;
                Cart.updateOne({ _id: cartId }, { $set: req.body })
                  .exec()
                  .then(() => {
                    Cart.findById(cartId, (err, cart) => {
                      if (err) {
                        console.log(err);
                        res.status(500).json({
                          status: 500,
                          error: err,
                        });
                      } else {
                        res.status(200).json({
                          status: 200,
                          message: `Cart #${cartId} updated!`,
                          cart,
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
              }
            } else {
              res.status(404).json({
                status: 404,
                message: `Cart #${cartId} not found.`,
              });
            }
          });
      } else {
        res.status(404).json({
          status: 404,
          message: `User #${userId} not found.`,
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
