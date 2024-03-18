const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const dashController = require('../controllers/dash')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest, homeController.getIndex)
router.get('/login', ensureGuest, authController.getLogin)
router.post('/login', ensureGuest, authController.postLogin)
router.get('/logout', ensureAuth, authController.getLogout)
router.get('/signup', ensureGuest, authController.getSignup)
router.post('/signup', ensureGuest, authController.postSignup)
router.get('/dashboard', ensureAuth, dashController.getDashboard)
router.get('/dashboard/confirmDelete', ensureAuth, dashController.getConfirmDelete)
router.delete('/dashboard/deleteAccount', ensureAuth, dashController.deleteAccount)

module.exports = router
