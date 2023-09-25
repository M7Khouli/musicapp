const dotEnv = require('dotenv');
const mongoose = require('mongoose');

dotEnv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('Unhandled Exception!!!💥💥 shutting down....');
  console.log(err.name, err.message);

  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const app = require('./app');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log('DB is connected !');
  });

const server = app.listen(process.env.PORT, '0.0.0.0');

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection!!!💥💥 shutting down....');
  console.log(err.name);
  server.close(() => {
    process.exit(1);
  });
});
