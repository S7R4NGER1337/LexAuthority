require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// ── Validate required env vars before anything else ──────────
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI environment variable is not set.');
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET must be set to a random string of at least 32 characters.');
  process.exit(1);
}
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_USERNAME and ADMIN_PASSWORD must be set.');
  process.exit(1);
}
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();

// ── Security headers ─────────────────────────────────────────
app.use(helmet());

// ── Compression ───────────────────────────────────────────────
app.use(compression());

// ── CORS — only allow our frontend origin ────────────────────
app.use(cors({ origin: CLIENT_ORIGIN, optionsSuccessStatus: 200, maxAge: 86400 }));

// ── Body parsing ─────────────────────────────────────────────
app.use('/api/admin/insights', express.json({ limit: '200kb' })); // insight body is HTML
app.use(express.json({ limit: '16kb' }));   // prevent large payload attacks

// ── NoSQL injection sanitization ─────────────────────────────
app.use(mongoSanitize());

// ── Rate limiting ─────────────────────────────────────────────
// General: 200 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
  })
);

// Stricter limit on the inquiry (contact form) endpoint
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many inquiries submitted. Please try again in an hour.' },
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/insights',       require('./routes/insights'));
app.use('/api/team',           require('./routes/team'));
app.use('/api/practice-areas', require('./routes/practiceAreas'));
app.use('/api/inquiries',      inquiryLimiter, require('./routes/inquiries'));
app.use('/api/admin',          require('./routes/admin'));

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

// ── Global error handler ─────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An internal error occurred.' });
});

// ── Database & server start ───────────────────────────────────
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
