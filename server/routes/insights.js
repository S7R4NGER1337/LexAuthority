const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// GET all insights (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const insights = await Insight.find(filter).sort({ publishedAt: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single insight by slug
router.get('/:slug', async (req, res) => {
  try {
    const insight = await Insight.findOne({ slug: req.params.slug });
    if (!insight) return res.status(404).json({ message: 'Not found' });
    res.json(insight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
