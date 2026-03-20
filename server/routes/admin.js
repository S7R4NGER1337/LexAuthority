const express    = require('express');
const jwt        = require('jsonwebtoken');
const rateLimit  = require('express-rate-limit');
const router     = express.Router();
const adminAuth  = require('../middleware/adminAuth');
const Insight    = require('../models/Insight');
const TeamMember = require('../models/TeamMember');
const PracticeArea = require('../models/PracticeArea');
const Inquiry    = require('../models/Inquiry');

// Stricter rate limit for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' },
});

// ── Auth ──────────────────────────────────────────────────────
router.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// All routes below require a valid token
router.use(adminAuth);

// ── Insights ──────────────────────────────────────────────────
router.get('/insights', async (req, res) => {
  try {
    res.json(await Insight.find().sort({ publishedAt: -1 }));
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

router.post('/insights', async (req, res) => {
  try {
    const doc = await Insight.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/insights/:id', async (req, res) => {
  try {
    const doc = await Insight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/insights/:id', async (req, res) => {
  try {
    await Insight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

// ── Team ──────────────────────────────────────────────────────
router.get('/team', async (req, res) => {
  try {
    res.json(await TeamMember.find().sort({ order: 1 }));
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

router.post('/team', async (req, res) => {
  try {
    const doc = await TeamMember.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/team/:id', async (req, res) => {
  try {
    const doc = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/team/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

// ── Practice Areas ────────────────────────────────────────────
router.get('/practice-areas', async (req, res) => {
  try {
    res.json(await PracticeArea.find().sort({ order: 1 }));
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

router.post('/practice-areas', async (req, res) => {
  try {
    const doc = await PracticeArea.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/practice-areas/:id', async (req, res) => {
  try {
    const doc = await PracticeArea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/practice-areas/:id', async (req, res) => {
  try {
    await PracticeArea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

// ── Inquiries ─────────────────────────────────────────────────
router.get('/inquiries', async (req, res) => {
  try {
    res.json(await Inquiry.find().sort({ createdAt: -1 }));
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

router.patch('/inquiries/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

router.delete('/inquiries/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch { res.status(500).json({ message: 'Failed.' }); }
});

module.exports = router;
