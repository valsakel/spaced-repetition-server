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
      res.json(user.questions[user.head]);
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

      // increase total value on each attempt
      answeredQuestion.total = answeredQuestion.total + 1;

      let isCorrect = false;
      // check correctness
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

      // return user.save();
      user.save();
      if (isCorrect) {
        res.json({
          answer: 'correct'
        });
      }
      else {
        res.json({
          answer: 'incorrect'
        });
      }
    })
    // .then(user => {

    //   if (user.questions[req.body.head].answer === req.body.answer.trim()) {
    //     res.json({
    //       answer: 'correct'
    //     });
    //   }
    //   res.json({
    //     answer: 'incorrect'
    //   });
    // })
    .catch(next);
});

// router.post('/answer', (req, res, next) => {
//   const { answer } = req.body
//   const userId = req.user.id;

//   User.findById(userId)
//     .then(user => {
//       const answeredQuestionIndex = user.head;
//       const answeredQuestion = user.questions[answeredQuestionIndex];
//       answeredQuestion.total = answeredQuestion.total + 1;
//       if (answer.trim() === answeredQuestion.answer) {
//         answeredQuestion.score = answeredQuestion.score + 1;
//         answeredQuestion.mValue = answeredQuestion.mValue * 2;
//       }
//       else {
//         answeredQuestion.mValue = 1;
//       }

//       user.head = answeredQuestion.next;

//       let currentQuestion = answeredQuestion;
//       for (let i = 0; i < answeredQuestion.mValue; i++) {
//         const nextIndex = currentQuestion.next;

//         currentQuestion = user.questions[nextIndex];
//       }

//       answeredQuestion.next = currentQuestion.next;
//       currentQuestion.next = answeredQuestionIndex;

//       return user.save();
//     })
//     .then(user => {
//       res.json(user);
//     })
// });

module.exports = router;
