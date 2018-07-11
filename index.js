'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect, dbGet } = require('./db-mongoose');

const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Parse request body
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/questions', questionsRouter);
app.use('/api/answers', answersRouter);

app.use('/api/users', usersRouter);
app.use('/api', authRouter);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

console.log(`MongoDB URI: ${dbGet().connection.host}:${dbGet().connection.port}`);

module.exports = { app };
