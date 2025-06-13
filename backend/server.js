const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

// Configs & Routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuth');
const paymentRoutes = require('./routes/payment');
require('./config/passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS for local development
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session middleware with MongoDB
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false // Set to true only in production with HTTPS
    },
  })
);

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());

// 🔍 Debug session info
app.use((req, res, next) => {
  console.log('🔍 Session:', req.user?.email || 'No user');
  next();
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Serve frontend from public/
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Fallback for SPA (Google redirects, routing, etc.)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Connect to DB and start server
mongoose.connect(process.env.MONGO_URI, { dbName: 'FixProm' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
