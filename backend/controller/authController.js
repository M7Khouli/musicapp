const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');

const singToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
  return token;
};

const sendToken = (user, statusCode, res) => {
  const token = singToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), //90days
    httpOnly: true,
  };
  //make cookie safe if we are at production
  if (process.env.Node_ENV === 'production') cookieOptions.secure = true;
  //send cookie
  res.cookie('jwt', token, cookieOptions);
  //hide the password
  user.password = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  sendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email: req.body.email }).select(
    '+password',
  );
  if (!user || !(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError('incorrect email or password', 400));

  sendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(new AppError('Unauthorized', 401));
  const token = req.headers.authorization.split(' ')[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).populate([
    'library',
    'friends',
    'friendRequests',
  ]);
  if (!user)
    return next(new AppError('Unauthorized, user does not exist', 401));
  req.user = user;
  next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('Unauthorized, This route require a high level role', 401),
      );
    next();
  };
};
