const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    category:    { type: String, required: true },
    title:       { type: String, required: true },
    excerpt:     { type: String, required: true },
    body:        { type: String, default: '' },
    author:      { type: String, default: '' },
    authorTitle: { type: String, default: '' },
    readTime:    { type: String, default: '' },
    tags:        [{ type: String }],
    imageUrl:    { type: String },
    imageAlt:    { type: String },
    publishedAt: { type: Date, default: Date.now },
    slug:        { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Insight', insightSchema);
