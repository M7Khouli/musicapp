const mongoose = require('mongoose');
const slugify = require('slugify');
const audioManager = require('../utils/audioManager');
const AppError = require('../utils/appError');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a song title'],
  },
  slug: String,
  directory: String,
  photo: {
    type: String,
  },
  genre: {
    type: String,
    enum: [
      'Alternative',
      'Arab',
      'Anime',
      'Blues',
      'Classical',
      'Country',
      'Dance',
      'Disco',
      'EDM',
      'Folk',
      'Funk',
      'Hip-Hop & Rap',
      'Jazz',
      'Metal',
      'Pop',
      'Rock',
      'R&B',
      'Soul',
    ],
    required: [true, 'Please enter a song genre'],
  },
  album: String,
  year: {
    type: Number,
    required: [true, 'Please enter a song year'],
  },
  artist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Artist',
    required: [true, 'please enter an artist !'],
  },
  length: String,
  public: {
    type: Boolean,
    default: false,
  },
  addedBy: {
    type: String,
    required: [true],
  },
  fingerprint: {
    type: Buffer,
    select: false,
  },
});

//add fingerprint to song
songSchema.pre('save', async function (next) {
  const fingerPrint = await audioManager.getFingerPrint(`./${this.directory}`);
  this.fingerprint = Buffer.from(fingerPrint.fingerprint, 'base64');
  const minutes = Math.floor(fingerPrint.duration / 60);
  const seconds = Math.round(fingerPrint.duration % 60);
  this.length = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  next();
});

songSchema.pre('save', async function (next) {
  const newSongfingerprint = this.fingerprint;
  const songss = this.model('Song').find().select('fingerprint');
  const songs = await songss.exec();

  for (const oldSongsFingerprint of songs) {
    const similarity = audioManager.getSimilarity(
      oldSongsFingerprint.fingerprint,
      newSongfingerprint,
    );
    if (similarity > 95)
      return next(new AppError('song already exists in database !', 401));
  }

  next();
});

//add slug to song to make search more efficient
songSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true, replacement: '-' });
  next();
});

songSchema.pre('find', function (next) {
  this.populate('artist', 'name');
  next();
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
