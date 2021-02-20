const User = require('../models/user');
const Receipt = require('../models/receipt');

exports.get_user_receipts = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        Receipt.find({ customer: userId })
          .select('timestamp customer items totalCost totalPaid paymentMethod')
          .exec()
          .then((receipts) => {
            res.status(200).json({
              status: 200,
              receipts,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              status: 500,
              ...err,
            });
          });
      } else {
        res.status(404).json({
          status: 404,
          message: `User #${userId} not found.`,
        });
      }
    });
};
