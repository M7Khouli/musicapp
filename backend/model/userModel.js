const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter a username'],
  },
  email: {
    type: String,
    unique: [true, 'email already exists !'],
  },
  friends: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  password: {
    type: String,
    required: [true, 'please enter a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please enter a password Confirm'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  library: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Song',
    },
  ],
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'moderator'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//compare password if it is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  currentPassword,
) {
  return await bcrypt.compare(candidatePassword, currentPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
