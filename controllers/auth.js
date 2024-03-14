const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const log = require('../utils/log')

const userHome = '/dashboard'

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect(userHome)
  }
  res.render('login', {
    title: "Log into your account",
    messages: req.flash(),
  })
}

exports.postLogin = [
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: userHome,
  }),
  function (err, req, res, next) {
    if (err) next(err)
  }
]

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err)
    req.flash('success', "You have logged out.")
    res.redirect('/')
  })
}

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect(userHome)
  }
  res.render('signup', {
    title: "Sign up for an account",
    messages: req.flash(),
  })
}

exports.postSignup = (req, res) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push("Please enter a valid email address.")
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push("Password must be at least 8 characters long.")
  if (req.body.password !== req.body.confirmPassword) validationErrors.push("Passwords do not match.")
  
  if (validationErrors.length) {
    req.flash('info', "Sign up failed.")
    req.flash('error', validationErrors)
    return res.redirect('/signup')
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
  User.register(new User({ email: req.body.email }),
		req.body.password,
		(err, user) => {
		  if (err) {
		    log.error("There was an error:", err, "\n", user)
		    req.flash('error', "Sign up failed.")
		    res.redirect('/signup')
		  }
		  passport.authenticate('local')(req, res, () => {
		    req.flash('success', "Your account has been created.")
		    res.redirect(userHome)
		  })
		})
}
