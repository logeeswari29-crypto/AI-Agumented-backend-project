const express = require('express');
const {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(addLocation)
  .get(getLocations);

router.route('/:id')
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;
