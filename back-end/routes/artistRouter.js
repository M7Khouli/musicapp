const express = require('express');
const artistController = require('../controller/artistController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, artistController.createArtist)
  .get(artistController.getAllArtists);

router.route('/:id').get(artistController.getArtist);

module.exports = router;
