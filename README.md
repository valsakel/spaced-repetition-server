FlashFluent - learning App
============================

This API provides resources for [FlashFluent](https://flashfluent.herokuapp.com/) app which documentation can be found [here](https://github.com/valsakel/spaced-repetition-client).

Live [URL](https://spaced-rep-marjef-server.herokuapp.com/)

## API Documentation
#### `GET /questions/next` - protected
 
Returns value of *propmt* field from document in 'users' collection for a user 
whose *id* obtained from JWT.

Example response:
 
```javascript
  "https://cdn5.kakao.im/wp-content/uploads/2018/07/2-134.jpg"
```

#### `POST /questions/answer` - protected
 
Returns values of *answer*, *correct*, *score*, and *total* fields from document in 
*users* collection for a user whose *id* obtained from JWT.
 
Example response:

```javascript
  {
    answer: "Taj Mahal",
    correct: false,
    score: 1,
    total: 3
  }
```

#### `POST /users/register` - unprotected

Creates a new document in *users* collection

Data parameters:

```javascript
 {
    firstname: "User",
    lastname: "Name",
    username: "username",  
    password: "password"
 } 
```

Example response:

```javascript
 {
    firstname: "User",
    lastname: "Name",
    username: "username",  
    password: "password"
    id: "5b753258a35dac0014b3ef94"
 }
```

## Getting started

### Setting up a project

* Move into your projects directory: `cd ~/YOUR_PROJECTS_DIRECTORY`
* Clone this repository: `git clone https://github.com/Thinkful-Ed/backend-template YOUR_PROJECT_NAME`
* Move into the project directory: `cd YOUR_PROJECT_NAME`
* Install the dependencies: `npm install`
* Create a new repo on GitHub: https://github.com/new
    * Make sure the "Initialize this repository with a README" option is left unchecked
* Update the remote to point to your GitHub repository: `git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME`

### Working on the project

* Move into the project directory: `cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME`
* Run the development task: `npm start`
    * Starts a server running at http://localhost:8080
    * Automatically restarts when any of your files change

## Databases

By default, the template is configured to connect to a MongoDB database using Mongoose.  It can be changed to connect to a PostgreSQL database using Knex by replacing any imports of `db-mongoose.js` with imports of `db-knex.js`, and uncommenting the Postgres `DATABASE_URL` lines in `config.js`.

## Deployment

Requires the [Heroku CLI client](https://devcenter.heroku.com/articles/heroku-command-line).

### Setting up the project on Heroku

* Move into the project directory: `cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME`
* Create the Heroku app: `heroku create PROJECT_NAME`

* If your backend connects to a database, you need to configure the database URL:
    * For a MongoDB database: `heroku config:set DATABASE_URL=mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`

* If you are creating a full-stack app, you need to configure the client origin: `heroku config:set CLIENT_ORIGIN=https://www.YOUR_DEPLOYED_CLIENT.com`

### Deploying to Heroku

* Push your code to Heroku: `git push heroku master`

 ## Tech Stack
 
 [Node.js](https://nodejs.org/en/)
 
 [Express.js](https://expressjs.com/)
 
 [MongoDB](https://www.mongodb.com/)
 
 [Mongoose](https://mongoosejs.com/)
 
 [Passport](http://www.passportjs.org/)
 
 [passport-jwt](https://www.npmjs.com/package/passport-jwt)
 
 [passport-local](https://www.npmjs.com/package/passport-local)
 
 [bcrypt.js](https://github.com/dcodeIO/bcrypt.js/blob/master/README.md)
 
 [JWT](https://jwt.io/)
 
 [dotenv](https://www.npmjs.com/package/dotenv)