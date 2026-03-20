require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// ── Validate required env vars before anything else ──────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is not set.');
  process.exit(1);
}
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();

// ── Security headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow our frontend origin ────────────────────
app.use(cors({ origin: CLIENT_ORIGIN, optionsSuccessStatus: 200 }));

// ── Body parsing ─────────────────────────────────────────────
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
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
