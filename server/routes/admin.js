const express      = require('express');
const jwt          = require('jsonwebtoken');
const rateLimit    = require('express-rate-limit');
const mongoose     = require('mongoose');
const XSS          = require('xss');
const router       = express.Router();
const adminAuth    = require('../middleware/adminAuth');
const Insight      = require('../models/Insight');
const TeamMember   = require('../models/TeamMember');
const PracticeArea = require('../models/PracticeArea');
const Inquiry      = require('../models/Inquiry');

// ── Helpers ───────────────────────────────────────────────────
const ALLOWED_CATEGORIES = [
  'Corporate Law', 'Litigation', 'Regulatory Affairs',
  'Intellectual Property', 'Real Estate', 'Corporate Governance',
];

// Whitelist-only HTML sanitizer for insight body
const bodyFilter = new XSS.FilterXSS({
  whiteList: {
    h2: [], h3: [], p: [], ul: [], li: [],
    div: ['class'],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object'],
});

function sanitizeBody(html) {
  if (!html || typeof html !== 'string') return '';
  return bodyFilter.process(html);
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isValidImageUrl(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

function isValidSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ── Rate limits ───────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' },
});

// Applies to all write operations after auth
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Too many requests. Please slow down.' },
});

// ── Auth ──────────────────────────────────────────────────────
const COOKIE_TTL_MS = 8 * 60 * 60 * 1000; // 8 h

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
  const token = jwt.sign(
    { username: process.env.ADMIN_USERNAME, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_TTL_MS,
  });
  res.json({ expiresAt: Date.now() + COOKIE_TTL_MS });
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out.' });
});

// All routes below require a valid token
router.use(adminAuth);
router.use(writeLimiter);

// ── Insights ──────────────────────────────────────────────────
router.get('/insights', async (req, res) => {
  try {
    res.json(await Insight.find().sort({ publishedAt: -1 }));
  } catch (err) {
    console.error('GET /admin/insights:', err);
    res.status(500).json({ message: 'Failed to fetch insights.' });
  }
});

router.post('/insights', async (req, res) => {
  const { title, excerpt, body, author, authorTitle, category, slug, tags, imageUrl, imageAlt, readTime, publishedAt } = req.body;
  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: 'Invalid category.' });
  }
  if (slug && !isValidSlug(slug)) {
    return res.status(400).json({ message: 'Slug must be lowercase alphanumeric with hyphens.' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const doc = await Insight.create({ title, excerpt, body: sanitizeBody(body), author, authorTitle, category, slug, tags, imageUrl, imageAlt, readTime, publishedAt });
    res.status(201).json(doc);
  } catch (err) {
    console.error('POST /admin/insights:', err);
    res.status(400).json({ message: 'Invalid insight data.' });
  }
});

router.put('/insights/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  const { title, excerpt, body, author, authorTitle, category, slug, tags, imageUrl, imageAlt, readTime, publishedAt } = req.body;
  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: 'Invalid category.' });
  }
  if (slug && !isValidSlug(slug)) {
    return res.status(400).json({ message: 'Slug must be lowercase alphanumeric with hyphens.' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const payload = { title, excerpt, body: sanitizeBody(body), author, authorTitle, category, slug, tags, imageUrl, imageAlt, readTime, publishedAt };
    // strip undefined so partial updates don't clear existing fields
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
    const doc = await Insight.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) {
    console.error('PUT /admin/insights/:id:', err);
    res.status(400).json({ message: 'Invalid insight data.' });
  }
});

router.delete('/insights/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  try {
    await Insight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('DELETE /admin/insights/:id:', err);
    res.status(500).json({ message: 'Failed to delete.' });
  }
});

// ── Team ──────────────────────────────────────────────────────
router.get('/team', async (req, res) => {
  try {
    res.json(await TeamMember.find().sort({ order: 1 }));
  } catch (err) {
    console.error('GET /admin/team:', err);
    res.status(500).json({ message: 'Failed to fetch team.' });
  }
});

router.post('/team', async (req, res) => {
  const { name, title, bio, imageUrl, imageAlt, order } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length > 120) {
    return res.status(400).json({ message: 'Name is required (max 120 chars).' });
  }
  if (!title || typeof title !== 'string' || title.trim().length > 120) {
    return res.status(400).json({ message: 'Title is required (max 120 chars).' });
  }
  if (bio && (typeof bio !== 'string' || bio.trim().length > 1000)) {
    return res.status(400).json({ message: 'Bio must be 1000 characters or fewer.' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const doc = await TeamMember.create({ name: name.trim(), title: title.trim(), bio: bio?.trim(), imageUrl, imageAlt, order });
    res.status(201).json(doc);
  } catch (err) {
    console.error('POST /admin/team:', err);
    res.status(400).json({ message: 'Invalid team member data.' });
  }
});

router.put('/team/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  const { name, title, bio, imageUrl, imageAlt, order } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim().length > 120)) {
    return res.status(400).json({ message: 'Name must be 120 characters or fewer.' });
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim().length > 120)) {
    return res.status(400).json({ message: 'Title must be 120 characters or fewer.' });
  }
  if (bio !== undefined && (typeof bio !== 'string' || bio.trim().length > 1000)) {
    return res.status(400).json({ message: 'Bio must be 1000 characters or fewer.' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const update = { name, title, bio, imageUrl, imageAlt, order };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    if (update.name)  update.name  = update.name.trim();
    if (update.title) update.title = update.title.trim();
    if (update.bio)   update.bio   = update.bio.trim();
    const doc = await TeamMember.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) {
    console.error('PUT /admin/team/:id:', err);
    res.status(400).json({ message: 'Invalid team member data.' });
  }
});

router.delete('/team/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('DELETE /admin/team/:id:', err);
    res.status(500).json({ message: 'Failed to delete.' });
  }
});

// ── Practice Areas ────────────────────────────────────────────
router.get('/practice-areas', async (req, res) => {
  try {
    res.json(await PracticeArea.find().sort({ order: 1 }));
  } catch (err) {
    console.error('GET /admin/practice-areas:', err);
    res.status(500).json({ message: 'Failed to fetch practice areas.' });
  }
});

router.post('/practice-areas', async (req, res) => {
  const { title, description, fullDescription, icon, imageUrl, order, slug, services, sectors } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length > 120) {
    return res.status(400).json({ message: 'Title is required (max 120 chars).' });
  }
  if (!description || typeof description !== 'string' || description.trim().length > 500) {
    return res.status(400).json({ message: 'Description is required (max 500 chars).' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const doc = await PracticeArea.create({ title: title.trim(), description: description.trim(), fullDescription, icon, imageUrl, order, slug, services, sectors });
    res.status(201).json(doc);
  } catch (err) {
    console.error('POST /admin/practice-areas:', err);
    res.status(400).json({ message: 'Invalid practice area data.' });
  }
});

router.put('/practice-areas/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  const { title, description, fullDescription, icon, imageUrl, order, slug, services, sectors } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim().length > 120)) {
    return res.status(400).json({ message: 'Title must be 120 characters or fewer.' });
  }
  if (description !== undefined && (typeof description !== 'string' || description.trim().length > 500)) {
    return res.status(400).json({ message: 'Description must be 500 characters or fewer.' });
  }
  if (!isValidImageUrl(imageUrl)) {
    return res.status(400).json({ message: 'imageUrl must be a valid http/https URL.' });
  }
  try {
    const update = { title, description, fullDescription, icon, imageUrl, order, slug, services, sectors };
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
    if (update.title)       update.title       = update.title.trim();
    if (update.description) update.description = update.description.trim();
    const doc = await PracticeArea.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) {
    console.error('PUT /admin/practice-areas/:id:', err);
    res.status(400).json({ message: 'Invalid practice area data.' });
  }
});

router.delete('/practice-areas/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  try {
    await PracticeArea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('DELETE /admin/practice-areas/:id:', err);
    res.status(500).json({ message: 'Failed to delete.' });
  }
});

// ── Inquiries ─────────────────────────────────────────────────
router.get('/inquiries', async (req, res) => {
  try {
    res.json(await Inquiry.find().sort({ createdAt: -1 }));
  } catch (err) {
    console.error('GET /admin/inquiries:', err);
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
});

router.patch('/inquiries/:id/status', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  const { status } = req.body;
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }
  try {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Not found.' });
    res.json(doc);
  } catch (err) {
    console.error('PATCH /admin/inquiries/:id/status:', err);
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

router.delete('/inquiries/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid ID.' });
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error('DELETE /admin/inquiries/:id:', err);
    res.status(500).json({ message: 'Failed to delete.' });
  }
});

module.exports = router;
