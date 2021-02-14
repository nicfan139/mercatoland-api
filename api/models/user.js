const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true,
  },
  type: {
    type: String,
    required: true,
    enum: ['CUSTOMER', 'MANAGER'],
  },
  email:{
    type:String,
    required:true,
    unique:true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password:{
    type:String,
    required:true,
    minLength: 6,
  },
  mobile:{
    type:Number,
    required:true,
    match: /\d{10}/,
  },
  address: {
    addressLineOne: {
      type: String,
      required: true,
    },
    addressLineTwo: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('User', userSchema);