const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  const sender = req.user;
  const { receiver } = req.body;
  if (sender.id === receiver)
    return next(new AppError('cannot send friend request to yourself !', 401));
  if (sender.friends.includes(receiver))
    return next(new AppError('Already have friend in friends list !', 401));

  const user = await User.findById(receiver);
  if (!user) return next(new AppError('No user exists !', 401));
  if (user.friendRequests.includes(sender.id))
    return next(new AppError('Friend request already sent !', 401));

  await User.findByIdAndUpdate(receiver, {
    $push: { friendRequests: sender.id },
  });

  res
    .status(200)
    .json({ status: 'success', message: 'Friend request sent successfully' });
});

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  const { sender } = req.body;
  const receiver = req.user;
  if (receiver.friendRequests.includes(sender))
    return next(new AppError('There is no friend request !', 401));
  await User.findByIdAndUpdate(receiver.id, {
    $pull: { friendRequests: sender },
    $push: { friends: sender },
  });
  await User.findByIdAndUpdate(sender, {
    $push: { friends: receiver.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'Friend request accepted successfully',
  });
});

exports.rejectFriendRequest = catchAsync(async (req, res, next) => {
  const receiver = req.user;
  const { sender } = req.body;

  if (!receiver.friendRequests.includes(sender))
    return next(new AppError('There is no friend request to this user !', 401));

  await User.findByIdAndUpdate(receiver.id, {
    $pull: { friendRequests: sender },
  });

  res.status(200).json({
    status: 'success',
    message: 'Friend request rejected successfully',
  });
});

exports.showFriendRequests = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user.friendRequests,
  });
});

exports.getFriendsList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user.friends,
  });
});

exports.deleteFriend = catchAsync(async (req, res, next) => {
  const friend = req.params.id;
  const { user } = req;
  if (user.friends.includes(friend))
    return next(new AppError('Friend does not exists in friend list', 401));
  await User.findByIdAndUpdate(user.id, {
    $pull: { friends: friend },
  });
  await User.findByIdAndUpdate(friend, {
    $pull: { friends: user.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'friend successfully deleted',
  });
});
