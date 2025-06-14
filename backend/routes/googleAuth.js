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
    session: true,
  }),
  (req, res) => {
    console.log('✅ Google login success:', req.user);

    // ✅ Dynamic redirect based on environment
    const redirectUrl =
      process.env.NODE_ENV === 'production'
        ? '/' // Render: app is served from root
        : '/'; // Local: also served from root (http://localhost:10000)

    res.redirect(redirectUrl);
  }
);

// ✅ Google Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
