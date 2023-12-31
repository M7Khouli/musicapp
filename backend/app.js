const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());

const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');
const songRouter = require('./routes/songRouter');
const artistRouter = require('./routes/artistRouter');
const userRouter = require('./routes/userRouter');
const friendRouter = require('./routes/friendRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to give extensive info in console about url

app.use(morgan('dev'));

app.use('/api/songs', songRouter);
app.use('/api/artists', artistRouter);
app.use('/api/users', userRouter);
app.use('/api/friends', friendRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot found ${req.originalUrl} on this server !`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
