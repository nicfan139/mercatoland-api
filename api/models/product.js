const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{
    type:String,
    required:true,
    unique:true,
    index:true,
  },
  price:{
    type:Number,
    required:true,
  },
  category: String,
  imgUrl: String,
  stock: Number,
});

module.exports = mongoose.model('Product', productSchema);