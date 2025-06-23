const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ✅ Step 1: Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// ✅ Step 2: Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res, next) => {
    console.log("✅ Google login success:", req.user);

    req.login(req.user, (err) => {
      if (err) {
        console.error("❌ Session login error:", err);
        return next(err);
      }

      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_HOME_URL}/login-success.html?token=${token}`;
      res.redirect(redirectUrl);
    });
  }
);

// ✅ Step 3: Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("❌ Logout failed:", err);
      return res.status(500).send("Logout failed");
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

module.exports = router;
