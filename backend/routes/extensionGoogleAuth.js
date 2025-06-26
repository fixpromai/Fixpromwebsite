const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // adjust path if needed

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/extension-google-login
router.post('/extension-google-login', async (req, res) => {
  const { credential } = req.body; // credential = Google ID token

  if (!credential) {
    return res.status(400).json({ message: 'Missing Google credential' });
  }

  try {
    // 1. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // 2. Extract user info from payload
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;
    const avatar = payload.picture;

    // 3. Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        avatar,
      });
    }

    // 4. Create app JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Only send safe fields to client
    const safeUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('❌ Extension Google login failed:', err);
    res.status(500).json({ message: 'Server error or invalid Google token' });
  }
});

// Deprecated: Use /me for robust auth checking
router.get('/extension-check-login', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      isLoggedIn: false,
      email: null,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      isLoggedIn: true,
      email: decoded.email,
    });
  } catch (err) {
    res.status(401).json({
      isLoggedIn: false,
      email: null,
    });
  }
});

// NEW: Robust endpoint to check login and user existence
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(200).json({ success: false, message: 'User not found' });
    }

    // Only send the email
    return res.status(200).json({
      success: true,
      email: user.email,
    });
  } catch (err) {
    return res.status(200).json({ success: false, message: 'Token invalid or expired' });
  }
});

module.exports = router;