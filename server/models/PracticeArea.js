const mongoose = require('mongoose');

const practiceAreaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PracticeArea', practiceAreaSchema);
