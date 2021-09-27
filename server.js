const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception', err.name, err.message);
  console.log('Shutting down');
  process.exit(1);
});

const app = require('./app');

// forming connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//listen to unhandledRejection events

process.on('uncaughtRejection', (err) => {
  console.log('Uncaught Rejection', err.name, err.message);
  console.log('Shutting down');
  server.close(() => process.exit(1));
});
