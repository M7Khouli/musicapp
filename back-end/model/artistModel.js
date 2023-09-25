const mongoose = require('mongoose');
const slugify = require('slugify');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please enter an artist name'],
      unique: [true, 'artist already exists !'],
    },
    photo: String,
    slug: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

//add songs to every artist
artistSchema.virtual('songs', {
  ref: 'Song',
  foreignField: 'artist',
  localField: '_id',
});

//add slug to artist to make search efficient
artistSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, replacement: '-' });
  next();
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
