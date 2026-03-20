const express = require('express');
const router = express.Router();
const PracticeArea = require('../models/PracticeArea');

router.get('/', async (req, res) => {
  try {
    const areas = await PracticeArea.find().sort({ order: 1 });
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
