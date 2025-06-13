const express = require('express');
const passport = require('passport');
const router = express.Router();

// ✅ Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // Optional: forces account selection every time
  })
);

// ✅ Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true, // ✅ ensure session is saved
  }),
  (req, res) => {
    console.log('✅ Google login success:', req.user);
    // Redirect to frontend homepage after successful login
    res.redirect('http://localhost:5500/index.html');
  }
);

// ✅ Google Logout (Optional, backend only)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
