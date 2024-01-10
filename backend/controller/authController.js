const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../model/userModel');
const sendEmail = require('../utils/email');

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
  const randomCode = Math.floor(Math.random() * 90000) + 10000;
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    verificationCode: randomCode,
  });

  await sendEmail({
    email: req.body.email,
    subject: 'SoundScape verification code',
    text: `Your soundScape activation code is : ${randomCode}`,
  });

  res.status(201).json({
    status: 'success',
    message:
      'account successfully created and a verification code has been sent.',
  });
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
  if (!user.activated) {
    return next(
      new AppError(
        'This user has not been activated , please activate your account',
        401,
      ),
    );
  }

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

  const user = await User.findById(decoded.id)
    .populate(['library', 'friends', 'friendRequests', 'favorite'])
    .lean();
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

exports.checkVerificationCode = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    '+verificationCode',
  );
  if (!user) {
    return next(new AppError('Please enter a valid email', 401));
  }
  if (user.activated) {
    return next(new AppError('User already has been activated !', 401));
  }
  if (user.verificationCode === req.body.code) {
    user.activated = true;
    user.verificationCode = undefined;
    await user.save({ validateBeforeSave: false });
    sendToken(user, 200, res);
  } else {
    return next(
      new AppError('The verification code is wrong, please try again', 401),
    );
  }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('no user exists with this email.', 400));
  }

  const randomCode = Math.floor(Math.random() * 90000) + 10000;
  await sendEmail({
    email: req.body.email,
    subject: 'SoundScape Password reset code',
    text: `Your SoundScape Password reset code is : ${randomCode}`,
  });

  user.passwordResetCode = randomCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'a password reset code has been sent !.',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetCode');

  if (!user || user.passwordResetCode !== req.body.resetCode) {
    return next(new AppError('expired or invalid password reset code.', 400));
  }
  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.verificationCode = undefined;
  user.activated = true;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
});
