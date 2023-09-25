const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Artist = require('../model/artistModel');

//if there is no artist id provided then run this middleware
exports.getArtistId = catchAsync(async (req, res, next) => {
  const song = req.body;
  if (!song.artistName) return next();
  //convert the song to slug to make search more efficient
  song.artistName = slugify(song.artistName, { replacement: '-', lower: true });
  const artist = await Artist.findOne({ slug: song.artistName });
  if (!artist) {
    return next(
      new AppError('please enter a valid artist name or create one', 400),
    );
  }
  req.body.artist = artist.id;
  next();
});

exports.createArtist = catchAsync(async (req, res, next) => {
  const artist = req.body;
  const newArtist = await Artist.create(artist);
  res.status(201).json({
    status: 'success',
    data: newArtist,
  });
});

exports.getAllArtists = catchAsync(async (req, res, next) => {
  const artist = await Artist.find();
  res.status(200).json({
    status: 'success',
    data: artist,
  });
});

exports.getArtist = catchAsync(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).populate('songs');
  res.status(200).json({
    status: 'success',
    data: artist,
  });
});
