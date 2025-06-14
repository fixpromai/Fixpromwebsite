const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

// Load .env and passport setup
dotenv.config();
require('./config/passport');

// Routes
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuth');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS config (allow Render + local frontend)
const allowedOrigins = [
  'http://localhost:10000',
  'https://fixpromwebsite.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session store in Mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fixpromsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: 'FixProm',
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // ✅ Secure cookie only in prod
    },
  })
);

// ✅ Passport session handling
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Static frontend
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Fallback for SPA routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Connect DB and start
mongoose.connect(process.env.MONGO_URI, { dbName: 'FixProm' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
