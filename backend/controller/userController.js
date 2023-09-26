const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    '-friendRequests -library',
  ); // show library for one user
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.getUserSongs = catchAsync(async (req, res, next) => {
  //const user = await User.findById(req.user.id).populate({ path: 'library' });
  res.status(200).json({
    status: 'success',
    data: req.user.library,
  });
});

exports.addSongFromCloud = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $push: { library: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'song successfully added !',
  });
});

exports.addSongToCloud = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, {
    public: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'song successfully added to the cloud !',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
});
