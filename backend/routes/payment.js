require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const Payment = require("../models/Payment"); // Import model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { name, email, address, amount } = req.body;

  if (!name || !email || !address || !amount) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    await Payment.create({
      name,
      email,
      address,
      amount,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order." });
  }
});

module.exports = router;
