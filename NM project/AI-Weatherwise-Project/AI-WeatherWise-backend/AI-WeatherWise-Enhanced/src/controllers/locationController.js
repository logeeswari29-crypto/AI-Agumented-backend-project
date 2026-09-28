const mongoose = require('mongoose');
const Location = require('../models/Location');

const validateLocationInput = (city, country) => {
  if (!city || !country) return 'City and country are required';
  if (String(city).trim().length < 2) return 'City name is too short';
  if (String(country).trim().length < 2) return 'Country name is too short';
  return null;
};

const addLocation = async (req, res) => {
  try {
    const { city, country } = req.body;
    const validationError = validateLocationInput(city, country);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const location = await Location.create({
      city: String(city).trim(),
      country: String(country).trim(),
      user: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Favorite location added',
      data: location
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This location is already in your favorites'
      });
    }

    console.error('[Location] Add error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to add location'
    });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('[Location] Get error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch favorite locations'
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { city, country } = req.body;
    const validationError = validateLocationInput(city, country);

    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }

    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { city: String(city).trim(), country: String(country).trim() },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Favorite location not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Favorite location updated',
      data: location
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This location is already in your favorites'
      });
    }

    console.error('[Location] Update error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to update location'
    });
  }
};

const deleteLocation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location ID'
      });
    }

    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Favorite location not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Favorite location deleted'
    });
  } catch (error) {
    console.error('[Location] Delete error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete location'
    });
  }
};

module.exports = {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
};
