const express = require('express');
//

const router = express.Router();

const authController = require('../controller/authController');
const userController = require('../controller/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router
  .route('/library')
  .get(authController.protect, userController.getUserSongs);

router
  .route('/library/:id')
  .post(authController.protect, userController.addSongToCloud);

router.route('/me').get(authController.protect, userController.getMe);
router.get('/:id', userController.getUser);

module.exports = router;
