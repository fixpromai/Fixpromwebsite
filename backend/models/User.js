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
    type: String // ✅ Added to store Google profile photo URL
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    validate: {
      validator: function (value) {
        if (!this.googleId) {
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
        }
        return true;
      },
      message: 'Password must have 1 capital, 1 number, 1 symbol & be 8+ characters.'
    }
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiry: Date,
  otpVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
