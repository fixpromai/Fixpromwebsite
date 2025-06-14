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

// ✅ CORS config (allow deployed domain)
const allowedOrigins = [
  'https://fixpromwebsite.onrender.com',
  'http://localhost:10000'
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

// ✅ Session store in MongoDB
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
      secure: true, // ✅ Important: HTTPS required in production (Render)
    },
  })
);

// ✅ Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Fallback for all unmatched frontend routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { dbName: 'FixProm' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
