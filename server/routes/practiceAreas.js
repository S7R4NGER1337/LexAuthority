const express = require('express');
const router = express.Router();
const PracticeArea = require('../models/PracticeArea');

router.get('/', async (req, res) => {
  try {
    const areas = await PracticeArea.find().sort({ order: 1 });
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json(areas);
  } catch (err) {
    console.error('Practice areas fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch practice areas.' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const area = await PracticeArea.findOne({ slug: req.params.slug });
    if (!area) return res.status(404).json({ message: 'Not found.' });
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json(area);
  } catch (err) {
    console.error('Practice area fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch practice area.' });
  }
});

module.exports = router;
