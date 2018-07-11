'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== POST/UPDATE AN ANSWER ========== */
router.post('/', (req, res, next) => {
  console.log(req.body);

  const userAnswer = req.body.answer.trim();
  console.log('USER ANSWER', userAnswer);

  User.findById(req.user.id)
    .then(user => {
      // console.log('RESULTS', user);
      const answerIndex = user.head;

      console.log('ANSWER INDEX', answerIndex);
      const question = user.questions[answerIndex];

      if (userAnswer === question.answer) {
        question.mValue = question.mValue * 2;
        console.log('RIGHT ANSWER');

      } else {
        console.log('WRONG ANSWER');
      }

      if (question.next) {
        user.head = question.next;
      } else {
        user.head = 0;
      }

      return User.findByIdAndUpdate({_id: req.user.id}, {head: user.head}, { new: true })
    })
    .then(user => {
      res.json(user)
    })
    .catch(next);
});

module.exports = router;
