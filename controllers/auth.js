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

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'Invalid credentials.')
      return res.render('login', {
	title: "Log into your account",
	messages: req.flash(),
      })
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.redirect(userHome)
    })
  })(req, res, next)
}

exports.getLogout = (req, res, next) => {
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

exports.postSignup = async (req, res) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email)) validationErrors.push("Please enter a valid email address.")
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push("Password must be at least 8 characters long.")
  if (req.body.password !== req.body.confirmPassword) validationErrors.push("Passwords do not match.")
  
  if (validationErrors.length) {
    req.flash('info', "Sign up failed.")
    req.flash('error', validationErrors)
    return res.render('signup', {
      title: "Sign up for an account",
      messages: req.flash(),
    })
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
  await User.register(new User({ email: req.body.email }),
		req.body.password,
		(err, user) => {
		  if (err) {
		    req.flash('info', "Sign up failed.")
		    req.flash('error', "Unable to create user.")
		    return res.render('signup', {
		      title: "Sign up for an account",
		      messages: req.flash(),
		    })
		  }
		  passport.authenticate('local')(req, res, () => {
		    req.flash('success', "Your account has been created.")
		    res.redirect(userHome)
		  })
		})
}
