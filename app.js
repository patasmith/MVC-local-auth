const path = require('path')
const express = require('express')

const passport = require('passport')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const connectDB = require('./utils/db')
const { MONGO_URI, EXT } = require('./utils/config')

const hbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')

app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(methodOverride((req, res) => {
  if (req.body
      && typeof req.body === 'object'
      && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

require('./utils/passport')(passport)

app.use(session({
  secret: 'festina lente',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: MONGO_URI })
}))

app.use(passport.initialize())
app.use(passport.session())

connectDB()

app.engine(EXT, hbs.engine({
  defaultLayout: 'main',
  extname: EXT,
}))
app.set('view engine', EXT)

app.use(flash())

app.use('/', require('./routes/main'))

app.use(express.static('public'))

module.exports = app
