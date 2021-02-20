const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: {
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
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
