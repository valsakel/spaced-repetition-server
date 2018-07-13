'use strict';

const express = require('express');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  User.find({})
    .then(results => {
      res.json(results);
    })
    .catch(next);
})

/* ========== GET A QUESTION ========== */
router.get('/next', (req, res, next) => {
  const userId = req.user.id;
  User.findById(userId)
    .then(user => {
      res.json(user.questions[user.head].prompt);
    })
    .catch(next);
});

/* ========== SAVE/UPDATE AN ANSWER ========== */
router.post('/answer', (req, res, next) => {
  const userId = req.user.id;

  const userAnswer = req.body.answer.trim().toLowerCase();

  User.findById(userId)
    .then(user => {
      const currIndex = user.head;
      const answeredQuestion = user.questions[currIndex];

      answeredQuestion.total = answeredQuestion.total + 1;

      let isCorrect = false;
      if (userAnswer === answeredQuestion.answer.toLowerCase()) {
        isCorrect = true;
        answeredQuestion.score = answeredQuestion.score + 1;
        answeredQuestion.mValue = (answeredQuestion.mValue * 2);
      } else {
        answeredQuestion.mValue = 1;
      }

      let count = answeredQuestion.mValue;
      let currObj = user.questions[currIndex];
      while (count && currObj.next !== null) {
        currObj = user.questions[currObj.next];
        count--;
      }

      user.head = answeredQuestion.next;
      answeredQuestion.next = currObj.next;
      currObj.next = currIndex;

      user.save();

      let results = {
        answer: answeredQuestion.answer,
        correct: isCorrect,
        score: answeredQuestion.score,
        total: answeredQuestion.total
      };

      return res.json(results);
    })
    .catch(next);
});

module.exports = router;
