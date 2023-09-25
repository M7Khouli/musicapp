const multer = require('multer');
const path = require('path');
const AppError = require('./appError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'song') cb(null, 'public/audio');
    else if (file.fieldname === 'photo') cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`); // the file name is his date of creation
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'song' && !file.mimetype.startsWith('audio/'))
    cb(new AppError('uploaded audio is not an audio file !', 400), false);
  else if (file.fieldname === 'photo' && !file.mimetype.startsWith('image/'))
    cb(new AppError('uploaded photo is not a photo file !', 400), false);
  else cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 20 },
});

module.exports = upload;
