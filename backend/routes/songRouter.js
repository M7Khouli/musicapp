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

router.route('/play/:songID').get(songController.playSong);

router
  .route('/:id')
  .post([authController.protect, userController.addSongFromCloud])
  .delete(authController.protect, songController.deleteSong);

module.exports = router;
