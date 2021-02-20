const jwt = require('jsonwebtoken');
const Receipt = require('../models/receipt');
const User = require('../models/user');

exports.get_all_receipts = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const { userId } = decoded;
  User.findById(userId)
    .exec()
    .then((user) => {
      // Only a user of type 'MANAGER' can see all receipts
      if (user.type === 'MANAGER') {
        Receipt.find()
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
        res.status(403).json({
          status: 403,
          message: 'The current user is not permitted to use this endpoint.',
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
