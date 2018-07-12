'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//TODO: see if there is a better solution
// we need to send answer and head value so we could use that data
// in the response body
// {
//   "answer": "hi",
//   "head": 2
// }
/* ========== POST/UPDATE AN ANSWER ========== */
router.post('/', (req, res, next) => {
  const userId = req.user.id;

  const userAnswer = req.body.answer.trim();

  User.findById(userId)
    .then(user => {

      const currIndex = user.head;
      const answeredQuestion = user.questions[currIndex];

      // increase total value on each attempt
      answeredQuestion.total = answeredQuestion.total + 1;

      // check correctness
      if (userAnswer === answeredQuestion.answer) {
        answeredQuestion.score = answeredQuestion.score + 1;
        answeredQuestion.mValue = (answeredQuestion.mValue * 2);
      } else {
        answeredQuestion.mValue = 1;
      }

      let count = answeredQuestion.mValue;

      let currObj = user.questions[currIndex];

      while(count && currObj.next !== null) {
        currObj = user.questions[currObj.next];
        count--;
      }
      user.head = answeredQuestion.next;
      answeredQuestion.next = currObj.next;
      currObj.next = currIndex;

      return user.save();
    })
    .then(user => {

      if ( user.questions[req.body.head].answer === req.body.answer.trim() ) {
        res.json({
          answer: 'correct'
        });
      }
      res.json({
        answer: 'incorrect'
      });
    })
    .catch(next);
});

module.exports = router;