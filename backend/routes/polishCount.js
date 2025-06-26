const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as needed for your project

// Endpoint to handle polish requests and enforce daily limits
router.post('/polishcount', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get today's date in YYYY-MM-DD format (UTC)
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = user.polishCountDate ? user.polishCountDate.toISOString().slice(0, 10) : null;

  if (!user.subscribed) {
    if (lastDate === today) {
      if (user.polishCount >= 5) {
        return res.json({ success: false, message: 'Daily limit reached. Please try again tomorrow.' });
      }
      user.polishCount += 1;
    } else {
      user.polishCount = 1;
      user.polishCountDate = new Date();
    }
  } else {
    // For subscribed users, no limit (optional: you can still track count if you want)
    user.polishCount += 1;
    user.polishCountDate = new Date();
  }

  await user.save();
  res.json({
    success: true,
    polishCount: user.polishCount,
    polishCountDate: user.polishCountDate,
    subscribed: user.subscribed,
    email: user.email
  });
});

module.exports = router;