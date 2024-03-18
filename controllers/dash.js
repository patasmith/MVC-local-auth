const User = require('../models/User')
const log = require('../utils/log')

exports.getDashboard = (req, res) => {
  res.render('dashboard', {
    title: "User dashboard",
    messages: req.flash(),
  })
}

exports.getConfirmDelete = (req, res) => {
  req.flash('confirm', req.user.email)
  return res.render('dashboard', {
    title: "User dashboard",
    messages: req.flash(),
  })
}

exports.deleteAccount = async (req, res) => {
    try {
      if (req.body.confirm === "yes") {
	await User.deleteOne({ _id: req.user._id })
	req.flash('info', `Account ${req.user.email} deleted.`)
	res.redirect('/')
      } else {
	req.flash('confirm', req.user.email)
	req.flash('confirmFailed', 'error')
	return res.render('dashboard', {
	  title: "User dashboard",
	  messages: req.flash(),
	})
      }
    } catch (err) {
      log.error(err)
    }
}
