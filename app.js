const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const mongodbsession = require('connect-mongodb-session')(session)
const authRoutes = require('./routes/authRoutes')

// initiate express app
const app = express()

// view engine
app.set('view engine', 'EJS')

// database connection
const dbURI = 'mongodb+srv://admin:36EVUSC1EORhnEX8@statusmelder.h3rwa.mongodb.net/statusmelder?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => app.listen(3000))
  .catch(err => console.log(err))

// session db connection
const isAuth = (req, res, next) => {
  if(req.session.isAuth) {
    next()
  } else {
    res.redirect('/login')
  }
}

const store = new mongodbsession({
  uri: dbURI,
  collection: 'Sessions'
})

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(session({
  secret: 'Die Grundsaetze von Deutsches Rotes Kreuz',
  resave: false,
  saveUninitialized: false,
  store: store
}))

// routes
app.get('/', (req, res) => res.render('index'))
app.get('/howto', (req, res) => res.render('howto'))
app.get('/dashboard', isAuth, (req, res) => res.render('dashboard'))
app.use(authRoutes)

// cookies
