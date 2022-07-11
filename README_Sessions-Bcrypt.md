# Build Auth & Sessions into our Fruits App - Lesson 1

## Lesson Objectives

- add sessions and auth on top of our fruits build

## Set up

- cd into the starter code, make sure you are on the same level as `package.json`
- `npm install` to install dependencies (express, ejs, method-override, mongoose)

## Set up environmental variables

We need a way to protect our sensitive information and a way to store environmental variables that are specific to our computer (in contrast to a co-workers computer or the environment in a cloud service).

In our class repo, at the route we have a `.gitignore` file. This file tells git which files to never track. In there it states to never track `node_modules` nor `.env` - that way our values stay safely on our machines.

- in `.env` let's set up the environmental variables for your port and mongo connection string

- `touch .env`
- `npm install dotenv`

in `.env`

```yml
PORT=3000
MONGODBURI=mongodb://localhost:27017/fruits_auth
```

**IMPORTANT** this is NOT a JavaScript file.

- No spaces!
- No semi-colons!
- No quotes!

- In `server.js` - under configuration
- `require('dotenv').config()`

The variables will be accessed by `process.env`

```js
const PORT = process.env.PORT
const mongodbURI = process.env.MONGODBURI
```

We should now be able to run nodemon

![](https://i.imgur.com/GAwB5h5.png)

- Go to `/fruits/setup/seed` to seed some data
- Make a fruit
- Update a fruit
- Delete a fruit

_________________

# Lesson 2

## Lesson Objectives

- add users model and controller
- add bcrypt and hash the password

## Set up

- We only need two routes for our user
- the new form to sign up a new user
- the post route to create a new user
- We want users to have their passwords encrypted on sign up

### Users model

- on same level as `package.json`
- `npm install bcrypt`

in `models/users.js`

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  password: String
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

in `server.js`

```js
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)
```

in `controllers/users_controller.js`

```js
const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')

users.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

users.post('/', (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    console.log('user is created', createdUser)
    res.redirect('/')
  })
})

module.exports = users
```

Check console for successful creation of user

_________________

# Lesson 3

## Lesson Objectives

- add sessions controller (no model - why?)
- add logic to check password

## Set up

- on same level as package.json
- `npm install express-session`
- configure express session

in `server.js`

in dependencies

```js
const session = require('express-session')
```

in middleware section

```js
app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)
```

in `.env` add

```yml
SECRET=FeedMeSeymour
```

- We only need the routes for our user
- the new form to log in
- the post route to create a new session
- the delete route to destroy a session

### Sessions Controller

in `server.js`

```js
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
```

in `controllers/sessions_controller.js`

```js
const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')

sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs', { currentUser: req.session.currentUser })
})

// on sessions form submit (log in)
sessions.post('/', (req, res) => {
  // username is found and password matches
  // successful log in

  // username is not found - who cares about password if you don't have a username that is found?
  // unsuccessful login

  // username found but password doesn't match
  // unsuccessful login

  // some weird thing happened???????

  // Step 1 Look for the username
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    // Database error
    if (err) {
      console.log(err)
      res.send('oops the db had a problem')
    } else if (!foundUser) {
      // if found user is undefined/null not found etc
      res.send('<a  href="/">Sorry, no user found </a>')
    } else {
      // user is found yay!
      // now let's check if passwords match
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // add the user to our session
        req.session.currentUser = foundUser
        // redirect back to our home page
        res.redirect('/')
      } else {
        // passwords do not match
        res.send('<a href="/"> password does not match </a>')
      }
    }
  })
})

sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = sessions
```

## Refactoring

- in every get route let's give access to the user

add the following to

```js
  ,
  currentUser: req.session.currentUser
```

- fruits.get/new
- fruits.get/:id/edit (update)
- fruits.get/:id (show)
- fruits.get/ (index)
- sessions.get/new
- users.get/new

Let's update the nav partial

```html
<ul class="right">
  <li><a href="/fruits/new">Create a new Fruit</a></li>
  <% if (currentUser) { %>
  <li>Welcome <%= currentUser.username %></li>
  <li>
    <form action="/sessions?_method=DELETE" method="POST">
      <input type="submit" value="Log Out" class="btn-small red" />
    </form>
  </li>
  <% } else { %>
  <li><a href="/users/new">Sign Up</a></li>
  <li><a href="/sessions/new">Log In</a></li>
  <% } %>
</ul>
```

_________________

# Lesson 4

## Lesson Objectives

- prevent non-logged in users from accessing parts of the site

## Set up

- Let's say we only want logged in users to be able to see the details of our fruits.

We can write some good old JS logic. If you are not logged in, you'll be redirected to the log in page. Otherwise you can access the show page.

```js
fruits.get('/:id', (req, res) => {
  if (req.session.currentUser) {
    Fruit.findById(req.params.id, (error, foundFruit) => {
      res.render('fruits/show.ejs', {
        fruit: foundFruit,
        currentUser: req.session.currentUser
      })
    })
  } else {
    res.redirect('/sessions/new')
  }
})
```

It would be annoying to write this logic for every route. We can, write some custom middleware to handle this for us

```js
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}
```

you can now prevent users who are not logged in from using the put and delete routes

```js
fruits.put('/:id', isAuthenticated, (req, res) =>
```
