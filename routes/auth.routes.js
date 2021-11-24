const router = require('express').Router()
const User = require('../models/user.model')

router.get('/signup', (req, res, next) => {
	res.render('auth/signup.hbs', { title: 'sign up or sign in' })
})

router.get('/signin', (req, res, next) => {
	res.render('auth/signin.hbs', { title: 'sign up or sign in' })
})

//router.post('/signup', (req, res, next) => {
// Here the parameters, which will be requested from the body
// like const { username, email, country, password, confirmPassword } = req.body
// n//eed to work on that form according to the model

module.exports = router
