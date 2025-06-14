const express = require('express');
const passport = require('passport');
const router = express.Router();

// ✅ Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// ✅ Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    console.log('✅ Google login success:', req.user);

    // Redirect to frontend after login (adjust if needed)
    const redirectUrl =
      process.env.CLIENT_HOME_URL || '/';

    res.redirect(redirectUrl);
  }
);

// ✅ Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
