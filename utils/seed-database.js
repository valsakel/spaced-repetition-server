'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Question = require('../models/question');
const User = require('../models/user');

const seedQuestions = require('../db/seed/questions');
const seedUsers = require('../db/seed/users');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all(seedUsers.map(user => User.hashPassword(user.password)));
  })
  .then(digests => {
    seedUsers.forEach((user, i) => user.password = digests[i]);

    return Promise.all([
      Question.insertMany(seedQuestions),
      Question.createIndexes(),

      User.insertMany(seedUsers),
      User.createIndexes(),
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
