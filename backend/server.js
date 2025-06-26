const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');

// Load environment variables and Passport config
dotenv.config();
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuth');
const paymentRoutes = require('./routes/payment');
const extensionGoogleAuthRoutes = require('./routes/extensionGoogleAuth');
const polishCount = require('./routes/polishCount');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS (adjust origin as needed for production)
app.use(cors({
  origin: true, // Or set to your frontend URL for production
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport (no session)
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', extensionGoogleAuthRoutes);
app.use('/', polishCount);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Database and Server
mongoose.connect(process.env.MONGO_URI, { dbName: 'FixProm' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });