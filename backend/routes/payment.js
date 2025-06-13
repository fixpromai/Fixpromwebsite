// const Razorpay = require('razorpay');

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// ✅ Temporary placeholder for disabled payment routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(503).json({ message: 'Payment service is currently disabled.' });
});

module.exports = router;
