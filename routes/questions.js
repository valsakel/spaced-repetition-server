'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Question = require('../models/question');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  Question.find()
    .then(results => res.json(results))
    .catch(next);
});
