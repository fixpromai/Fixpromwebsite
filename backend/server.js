const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuth');
const paymentRoutes = require('./routes/payment'); // ✅ Import payment routes
require('./config/passport');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Setup
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

// ✅ Persistent Sessions with MongoDB Store
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fixpromsecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: 'FixProm',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      secure: false // ✅ Ensure this is false in local development (no HTTPS)
    },
  })
);

// 🔐 Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// 🔍 Optional: Debugging Middleware
app.use((req, res, next) => {
  console.log('🔍 Session Check:', req.user?.email || 'Not logged in');
  next();
});

// ✅ Routes
app.get('/', (req, res) => {
  res.send('✅ FixProm backend is running');
});
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/api/payment', paymentRoutes); // ✅ Attach payment routes

// ✅ Connect DB and Start
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'FixProm',
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
