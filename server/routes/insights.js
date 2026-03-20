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

// GET /api/insights
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      if (!ALLOWED_CATEGORIES.includes(req.query.category)) {
        return res.status(400).json({ message: 'Invalid category.' });
      }
      filter.category = req.query.category;
    }
    const insights = await Insight.find(filter).sort({ publishedAt: -1 });
    res.json(insights);
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
    res.json(insight);
  } catch (err) {
    console.error('Insight fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch insight.' });
  }
});

module.exports = router;
