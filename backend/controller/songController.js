const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const mm = require('music-metadata');

const Song = require('../model/songModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Artist = require('../model/artistModel');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../model/userModel');

exports.createSong = catchAsync(async (req, res, next) => {
  try {
    req.body.directory = req.files.song[0].path;
    req.body.addedBy = req.user.id;
    if (req.files.photo) req.body.photo = req.files.photo[0].path;

    const newSong = await Song.create(req.body);
    //hide fingerprint
    newSong.fingerprint = undefined;
    //push song to user library
    await User.findByIdAndUpdate(req.user.id, {
      $push: { library: newSong._id },
    });
    res.status(201).json({
      status: 'success',
      data: newSong,
    });
  } catch (err) {
    //if there is an error then delete the uploaded file
    if (req.files.song && req.files.song[0]) {
      await fs.unlink(req.files.song[0].path);
    }
    if (req.files.photo && req.files.photo[0]) {
      await fs.unlink(req.files.photo[0].path);
    }
    return next(err);
  }
});

exports.getAllSongs = catchAsync(async (req, res, next) => {
  req.user = JSON.parse(JSON.stringify(req.user));
  const userLibraryIds = req.user.library.map((song) => song._id.toString());
  const userFavoriteIds = req.user.favorite.map((song) => song._id.toString());
  const features = new APIFeatures(
    Song.find({ public: { $eq: true } }).lean(),
    req.query,
  ).pagination();
  const songs = await features.query;
  songs.forEach((song) => {
    song.inLibrary = userLibraryIds.includes(song._id.toString());
    song.inFavorite = userFavoriteIds.includes(song._id.toString());
  });
  res.status(200).json({
    status: 'success',
    data: songs,
  });
});

exports.getRandomSong = catchAsync(async (req, res, next) => {
  const randomSong = await Song.aggregate([
    { $match: { public: true } },
    { $sample: { size: 1 } },
    {
      $project: {
        fingerprint: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: randomSong,
  });
});

exports.playSong = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.songID);
  const ext = path.extname(song.directory).slice(1);
  res.setHeader('Content-Type', `audio/${ext}`);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${song.title}.${ext}"`,
  );
  //check if the user authorized to hear the songs
  if (!song.public) {
    if (req.user.id !== song.addedBy)
      return next(new AppError('unauthorized to access this song', 401));
  }
  const songPath = song.directory;
  const stream = fss.createReadStream(songPath);
  stream.pipe(res);
});

exports.getSongImage = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.songID);
  const ext = path.extname(song.photo).slice(1);
  res.setHeader('Content-Type', `Image/${ext}`);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${song.title}.${ext}"`,
  );
  //check if the user authorized to hear the songs
  if (!song.public) {
    if (req.user.id !== song.addedBy)
      return next(new AppError('unauthorized to access this song', 401));
  }
  const photoPath = song.photo;
  res.sendFile(path.resolve(photoPath));
});

exports.deleteSong = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.id);
  if (song.addedBy !== req.user.id) {
    return next(new AppError('Unauthorized to delete this song', 401));
  }
  const users = await User.find();
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].library.length; j++) {
      if (users[i].library[j] == song.id) {
        await User.updateOne(
          { _id: users[i].id },
          { $pull: { library: song.id } },
        );
        await User.updateOne(
          { _id: users[i].id },
          { $pull: { favorite: song.id } },
        );
      }
    }
  }
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'song has been deleted successfully',
  });
});

/* exports.updateSong = catchAsync(async (req, res, next) => {
  const ogSong = Song.findById(req.params.id);
  //if the user didn't add this song originally then he is unauthorized
  if (ogSong.addedBy !== req.user.id)
    return new AppError(
      'Unauthorized to do this action, you do not have the song!',
      401,
    );
  const updatedSong = Song.findByIdAndUpdate(req.params.id, {
    photo: req.body.photo,
  });
  res.status(200).json({
    status: 'success',
    data: updatedSong,
  });
});
 */
