const express = require('express');
const passport = require('passport');
const router = express.Router();

// ✅ Step 1: Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // shows account picker even if already logged in
  })
);

// ✅ Step 2: Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false, // Prevent auto-login – we do manual session login below
  }),
  (req, res, next) => {
    console.log('✅ Google login success:', req.user);

    // ✅ Manually establish session using req.login
    req.login(req.user, (err) => {
      if (err) {
        console.error('❌ Session login error:', err);
        return next(err);
      }

      // 🔁 Redirect to frontend homepage after successful login
      const redirectUrl = process.env.CLIENT_HOME_URL || '/';
      res.redirect(redirectUrl);
    });
  }
);

// ✅ Step 3: Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('❌ Logout failed:', err);
      return res.status(500).send('Logout failed');
    }

    // ✅ Destroy session & clear cookie
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
