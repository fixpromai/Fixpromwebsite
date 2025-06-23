const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

// Load environment variables and Passport config
dotenv.config();
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuth');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Enable CORS (minimal because frontend is on same domain)
app.use(cors({
  origin: true,
  credentials: true,
}));

// ✅ Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure session middleware with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fixpromsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: 'FixProm',
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none',  
      secure: true,
    },
  })
);

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Use defined routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Serve static files from public folder (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Fallback to index.html for all unmatched frontend routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { dbName: 'FixProm' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
