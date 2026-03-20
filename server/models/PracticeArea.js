const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  { icon: String, title: String, description: String },
  { _id: false }
);

const sectorSchema = new mongoose.Schema(
  { title: String, description: String },
  { _id: false }
);

const practiceAreaSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    description:     { type: String, required: true },
    fullDescription: { type: String, default: '' },
    icon:            { type: String, required: true },
    imageUrl:        { type: String },
    order:           { type: Number, default: 0 },
    slug:            { type: String, required: true, unique: true },
    services:        { type: [serviceSchema], default: [] },
    sectors:         { type: [sectorSchema],  default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PracticeArea', practiceAreaSchema);
