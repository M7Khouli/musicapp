const AppError = require('../utils/appError');

const handelTokenExpireError = () => {
  return new AppError('Invalid token, token mandate has been expired !', 401);
};

const handelFileLimitErrorMulter = () => {
  return new AppError('Audio limit of 20mb has been exceeded', 400);
};

const handelExistSongTitleDB = () => {
  return new AppError('Song title already exists in database !', 400);
};

const handleTokenInvalidError = () => {
  return new AppError('invalid token, please re login and try later.', 401);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error', err);
    res.status(500).json({
      status: 'error',
      message: 'some big error has happened',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (err.code === 'LIMIT_FILE_SIZE') error = handelFileLimitErrorMulter();
    if (err.name === 'TokenExpiredError') error = handelTokenExpireError();
    if (err.code === 11000) error = handelExistSongTitleDB();
    if (err.name === 'JsonWebTokenError') error = handleTokenInvalidError();
    sendErrorProd(error, res);
  }
};
