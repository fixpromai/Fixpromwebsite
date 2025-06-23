const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendEmail');

const tempUsers = {};

exports.requestSignupOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (tempUsers[email]) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      tempUsers[email].otp = otp;
      tempUsers[email].otpExpiry = otpExpiry;

      await sendVerificationEmail(email, otp);
      console.log('🔁 Resent signup OTP to:', email);
      return res.status(200).json({ message: 'New OTP sent to your email.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required for first-time signup' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    tempUsers[email] = { hashedPassword, otp, otpExpiry };
    await sendVerificationEmail(email, otp);

    console.log('📩 Signup OTP sent to:', email);
    return res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    console.error('❌ Signup OTP error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const temp = tempUsers[email];

    if (!temp) return res.status(400).json({ message: 'No signup request found' });
    if (temp.otp !== otp || temp.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = new User({
      email,
      password: temp.hashedPassword,
      isVerified: true
    });

    await user.save();
    delete tempUsers[email];

    req.login(user, (err) => {
      if (err) {
        console.error('❌ Session creation failed:', err);
        return res.status(500).json({ message: 'Login session error' });
      }

      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          return res.status(500).json({ message: 'Session save failed' });
        }

        return res.status(200).json({
          message: 'Signup and login successful',
          user: {
            email: user.email,
            _id: user._id
          }
        });
      });
    });
  } catch (err) {
    console.error('❌ Signup verify error:', err.message);
    return res.status(500).json({ message: 'Server error during signup' });
  }
};

exports.resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const temp = tempUsers[email];
    if (!temp) return res.status(400).json({ message: 'No signup request found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    temp.otp = otp;
    temp.otpExpiry = otpExpiry;

    await sendVerificationEmail(email, otp);
    console.log('🔁 Resent signup OTP to:', email);
    return res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (err) {
    console.error('❌ Resend signup OTP error:', err.message);
    return res.status(500).json({ message: 'Server error while resending signup OTP' });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified. Reset your password first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    req.login(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          _id: user._id
        }
      });
    });
  } catch (err) {
    console.error('❌ Sign-in error:', err.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpVerified = false;
    await user.save();

    await sendVerificationEmail(email, otp);
    console.log('📩 Forgot password OTP sent to:', email);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp: String(otp) });

    if (!user || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otpVerified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified. You can now reset your password.' });
  } catch (err) {
    console.error('❌ OTP verify error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp: String(otp), otpVerified: true });

    if (!user) return res.status(400).json({ message: 'OTP verification required or invalid OTP.' });
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpVerified = undefined;

    await user.save();
    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    return res.status(500).json({ message: 'Server error during reset.' });
  }
};

// ✅ Updated token-based check-login logic
exports.checkLoginStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('❌ Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

exports.check = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(401).json({ message: 'Not logged in' });
};
