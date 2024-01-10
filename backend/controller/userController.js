const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    '-friendRequests -library -favorite',
  ); // show library for one user
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.getUserSongs = catchAsync(async (req, res, next) => {
  //const user = await User.findById(req.user.id).populate({ path: 'library' });
  req.user = JSON.parse(JSON.stringify(req.user));
  const userLibrary = req.user.library;
  const userFavoriteIds = req.user.favorite.map((song) => song._id.toString());
  userLibrary.forEach((song) => {
    song.inFavorite = userFavoriteIds.includes(song._id.toString());
  });
  res.status(200).json({
    status: 'success',
    data: userLibrary,
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

exports.removeSongFromLibrary = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { library: req.params.id },
  });
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { favorite: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'song removed from library',
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

exports.addSongToFavorite = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $push: { favorite: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'song successfully added to the favorite !',
  });
});

exports.getFavorite = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: req.user.favorite,
  });
});

exports.removeSongFromFavorite = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { favorite: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    message: 'song successfully removed from favorite',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
});
