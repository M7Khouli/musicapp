const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const mm = require('music-metadata');

const Song = require('../model/songModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Artist = require('../model/artistModel');
const User = require('../model/userModel');

exports.createSong = catchAsync(async (req, res, next) => {
  try {
    req.body.directory = req.files.song[0].path;
    req.body.addedBy = req.user.id;
    if (req.body.photo) req.body.photo = req.files.photo[0].path;
    const metadata = await mm.parseFile(req.body.directory);
    const minutes = Math.floor(metadata.format.duration / 60);
    req.body.length =
      minutes + ':' + Math.floor(metadata.format.duration - minutes * 60);
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
  const songs = await Song.find({ public: { $eq: true } }); //exclude private songs to keep privacy
  res.status(200).json({
    status: 'success',
    data: songs,
  });
});

exports.playSong = catchAsync(async (req, res, next) => {
  const song = await Song.findById(req.params.songID);
  //check if the user authorized to hear the songs
  if (!song.public) {
    if (req.user.id !== song.addedBy)
      return next(new AppError('unauthorized to access this song', 401));
  }
  const songPath = song.directory;
  const stream = fss.createReadStream(songPath);
  stream.pipe(res);
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
