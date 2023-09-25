const express = require('express');

const songController = require('../controller/songController');
const artistController = require('../controller/artistController');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const upload = require('../utils/songUploadOptions'); // the upload options separated in util file

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    artistController.getArtistId,
    upload.fields([
      { name: 'song', maxCount: 1 },
      { name: 'photo', maxCount: 1 },
    ]),
    songController.createSong,
  )
  .get(songController.getAllSongs);

router.post('/:id', [authController.protect, userController.addSongFromCloud]);

module.exports = router;
