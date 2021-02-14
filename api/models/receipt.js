const mongoose = require('mongoose');
const moment = require('moment');

const receiptSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timestamp: {
    type: mongoose.Schema.Types.Date,
    default: moment(),
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
      itemTotalCost: {
        type: Number,
        default: 0,
      }
    },
  ],
  totalCost: {
    type: Number,
    required: true,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['DEBIT', 'CREDIT'],
  },
});

module.exports = mongoose.model('Receipt', receiptSchema);