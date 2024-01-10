const express = require('express');
//

const router = express.Router();

const authController = require('../controller/authController');
const userController = require('../controller/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.post('/activate', authController.checkVerificationCode);
router
  .route('/library')
  .get(authController.protect, userController.getUserSongs);

router
  .route('/library/favorite')
  .get(authController.protect, userController.getFavorite);
router
  .route('/library/favorite/:id')
  .post(authController.protect, userController.addSongToFavorite)
  .delete(authController.protect, userController.removeSongFromFavorite);

router
  .route('/library/:id')
  .post(authController.protect, userController.addSongFromCloud)
  .delete(authController.protect, userController.removeSongFromLibrary);

router.route('/me').get(authController.protect, userController.getMe);
router.get('/:id', userController.getUser);

module.exports = router;
