const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

const ALLOWED_CATEGORIES = [
  'Corporate Law',
  'Litigation',
  'Regulatory Affairs',
  'Intellectual Property',
  'Real Estate',
  'Corporate Governance',
];

// GET /api/insights?page=1&limit=6&category=X
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      if (!ALLOWED_CATEGORIES.includes(req.query.category)) {
        return res.status(400).json({ message: 'Invalid category.' });
      }
      filter.category = req.query.category;
    }

    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit) || 6));
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const skip  = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Insight.find(filter).select('-body').sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Insight.countDocuments(filter),
    ]);

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Insights fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch insights.' });
  }
});

// GET /api/insights/:slug
router.get('/:slug', async (req, res) => {
  try {
    const insight = await Insight.findOne({ slug: req.params.slug });
    if (!insight) return res.status(404).json({ message: 'Not found.' });
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json(insight);
  } catch (err) {
    console.error('Insight fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch insight.' });
  }
});

module.exports = router;
