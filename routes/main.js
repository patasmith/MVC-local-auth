const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest, homeController.getIndex)
router.get('/login', ensureGuest, authController.getLogin)
router.post('/login', ensureGuest, ...authController.postLogin)
router.get('/logout', ensureAuth, authController.logout)
router.get('/signup', ensureGuest, authController.getSignup)
router.post('/signup', ensureGuest, authController.postSignup)
router.get('/dashboard', ensureAuth, homeController.getDashboard)

module.exports = router
