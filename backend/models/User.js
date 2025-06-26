const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allows multiple nulls
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    default: null
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  polishCount: {
    type: Number,
    default: 0
  },
  polishCountDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);