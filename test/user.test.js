'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');

const User = require('../models/user');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

before(function () {
  return dbConnect(TEST_DATABASE_URL);
});

after(function () {
  return dbDisconnect();
});

// describe('Mocha and Chai', function () {
//   it('should be properly setup', function () {
//     expect(true).to.be.true;
//   });
// });

describe('Spaced Repetition - Users', function() {
  const username = 'sampleUser';
  const password = 'samplePass';
  const firstname = 'Sample First Name';
  const lastname = 'Sample Last Name';
  const head = 0;

  before(function() {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return User.createIndexes();
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('/api/users/register', function() {
    describe('POST', function() {
      it('Should create a user', function() {
        let res;
        return chai
          .request(app)
          .post('/api/users/register')
          .send({
            username,
            password,
            firstname,
            lastname})
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'firstname',
              'lastname',
              'head',
              'username',
              'id');
            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(username);
            expect(res.body.firstname).to.equal(firstname);
            expect(res.body.lastname).to.equal(lastname);
            expect(res.body.head).to.equal(head);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.username).to.equal(username);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });

      it('Should trim firstname', function () {
        return chai
          .request(app)
          .post('/api/users/register')
          .send({ username, password, firstname: ` ${firstname}`, lastname })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            // expect(res.body).to.have.keys('id', 'username');
            expect(res.body.firstname).to.equal(firstname);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstname).to.equal(firstname);
          });
      });

      it('Should trim lastname', function () {
        return chai
          .request(app)
          .post('/api/users/register')
          .send({ username, password, firstname, lastname: ` ${lastname}` })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'firstname',
              'lastname',
              'head',
              'username',
              'id');
            expect(res.body.lastname).to.equal(lastname);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.lastname).to.equal(lastname);
          });
      });
      
    })
  })

});
