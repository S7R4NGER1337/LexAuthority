const express = require('express');
const router = express.Router();
const validator = require('validator');
const Inquiry = require('../models/Inquiry');

const ALLOWED_AREAS = ['corporate', 'litigation', 'intellectual', 'private', 'real-estate', 'employment'];

// POST /api/inquiries
router.post('/', async (req, res) => {
  const { name, email, practiceArea, message } = req.body;

  // ── Presence checks ──────────────────────────────────────
  if (!name || !email || !practiceArea || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // ── Type checks ───────────────────────────────────────────
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof practiceArea !== 'string' ||
    typeof message !== 'string'
  ) {
    return res.status(400).json({ message: 'Invalid input.' });
  }

  // ── Length limits ─────────────────────────────────────────
  if (name.trim().length > 120) {
    return res.status(400).json({ message: 'Name must be 120 characters or fewer.' });
  }
  if (message.trim().length > 4000) {
    return res.status(400).json({ message: 'Message must be 4000 characters or fewer.' });
  }

  // ── Email format ──────────────────────────────────────────
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // ── Whitelist practice area ───────────────────────────────
  if (!ALLOWED_AREAS.includes(practiceArea)) {
    return res.status(400).json({ message: 'Invalid practice area selected.' });
  }

  try {
    const inquiry = await Inquiry.create({
      name: validator.escape(name.trim()),
      email: validator.normalizeEmail(email) || email.toLowerCase().trim(),
      practiceArea,
      message: validator.escape(message.trim()),
    });
    res.status(201).json({ message: 'Inquiry submitted successfully.', id: inquiry._id });
  } catch (err) {
    console.error('Inquiry creation error:', err);
    res.status(500).json({ message: 'Failed to submit inquiry. Please try again.' });
  }
});

module.exports = router;
