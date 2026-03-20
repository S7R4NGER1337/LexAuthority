const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// POST new inquiry
router.post('/', async (req, res) => {
  const { name, email, practiceArea, message } = req.body;
  if (!name || !email || !practiceArea || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const inquiry = await Inquiry.create({ name, email, practiceArea, message });
    res.status(201).json({ message: 'Inquiry submitted successfully.', id: inquiry._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
