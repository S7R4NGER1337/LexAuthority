const mongoose = require('mongoose');

const ALLOWED_AREAS = ['corporate', 'litigation', 'intellectual', 'private', 'real-estate', 'employment'];

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [120, 'Name must be 120 characters or fewer.'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address.'],
    },
    practiceArea: {
      type: String,
      required: true,
      enum: { values: ALLOWED_AREAS, message: 'Invalid practice area.' },
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [4000, 'Message must be 4000 characters or fewer.'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
