const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'Please provide a city name'],
      trim: true,
      minlength: [2, 'City name is too short'],
      maxlength: [80, 'City name is too long']
    },
    country: {
      type: String,
      required: [true, 'Please provide a country name'],
      trim: true,
      minlength: [2, 'Country name is too short'],
      maxlength: [80, 'Country name is too long']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

locationSchema.index({ user: 1, city: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);
