const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.get_all_users = (req, res, next) => {
  User.find()
    .select('firstName lastName type email password mobile address')
    .exec()
    .then((users) => {
      res.status(200).json({
        status: 200,
        users,
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

exports.get_user = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .select('firstName lastName type email password mobile address')
    .exec((err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: 500,
          ...err,
        });
      } else {
        if (!result) {
          res.status(404).json({
            status: 404,
            message: `User #${userId} not found`,
          });
        } else {
          res.status(200).json({
            status: 200,
            user: result,
          });
        }
      }
    });
};

exports.register_new_user = (req, res, next) => {
  // Check if user already exists in the database
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length > 0) {
        res.status(422).json({
          status: 422,
          message: `User '${req.body.email}' already exists.`,
        });
      } else {
        // Hash the password submitted by the user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              status: 500,
              ...err,
            });
          } else {
            const user = new User({
              ...req.body,
              _id: mongoose.Types.ObjectId(),
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  status: 201,
                  message: `User ${req.body.email} created!`,
                  user,
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
        });
      }
    });
};

exports.authenticate_user = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .select('_id firstName lastName type email password mobile address')
    .exec()
    .then((user) => {
      if (!user) {
        res.status(401).json({
          status: 401,
          message: 'Authorization failed. Invalid email/password combination.',
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          res.status(401).json({
            status: 401,
            message:
              'Authorization failed. Invalid email/password combination.',
          });
        } else {
          if (result) {
            const payload = {
              email: user.email,
              userId: user._id,
            };
            if (!req.body.keepSignedIn) {
              payload.exp = Math.floor(Date.now() / 1000) + 60 * 60;
            }
            const token = jwt.sign(payload, process.env.JWT_KEY);
            res.status(200).json({
              status: 200,
              message: 'Authorization successful.',
              token,
              user,
            });
          } else {
            res.status(401).json({
              status: 401,
              message:
                'Authorization failed. Invalid email/password combination.',
            });
          }
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

exports.edit_user = (req, res, next) => {
  const id = req.params.userId;
  User.updateOne({ _id: id }, { $set: req.body })
    .exec()
    .then(() => {
      User.findById(id, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 500,
            ...err,
          });
        } else {
          res.status(200).json({
            status: 200,
            message: `Updated details for user #${id}!`,
            user,
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

exports.delete_user = (req, res, next) => {
  const { userId } = req.params;
  User.remove({ _id: userId })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        status: 200,
        message: `User #${userId} deleted.`,
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
