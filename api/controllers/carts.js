const Cart = require('../models/cart');

exports.get_all_carts = (req, res, next) => {
  Cart.find()
    .select('userId items')
    .exec()
    .then(carts => {
      res.status(200).json({
        status: 200,
        carts,
      });
    })
    .catch(err => {
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
    .then(result => {
      console.log(result);
      res.status(200).json({
        status: 200,
        message: `Cart #${cartId} deleted.`
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: 500,
        ...err,
      });
    });
};