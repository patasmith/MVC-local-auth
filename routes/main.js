const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth') 

router.get('/', homeController.getIndex)
router.get('/login', authController.getLogin)
router.post('/login', ...authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/dashboard', homeController.getDashboard)

module.exports = router
