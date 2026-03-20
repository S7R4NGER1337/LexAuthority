const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
