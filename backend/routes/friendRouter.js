const express = require('express');
const friendController = require('../controller/friendController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(authController.protect, friendController.getFriendsList);
router
  .route('/:id')
  .delete(authController.protect, friendController.deleteFriend);
router
  .route('/requests')
  .get(authController.protect, friendController.showFriendRequests)
  .post(authController.protect, friendController.sendFriendRequest);
router
  .route('/requests/accept')
  .post(authController.protect, friendController.acceptFriendRequest);

module.exports = router;
