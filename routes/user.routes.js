const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const bcrypt = require('bcryptjs')
const uploader = require('./cloudinary.config')
const passport = require('passport')

router.get('/profile', (req, res, next) => {
	if (req.session.passport) {
		req.session.myProperty = { _id: req.session.passport.user }
	}
	console.log(req.session)
	res.render('user/user-profile')
})

router.get('/signin', (req, res, next) => {
	res.render('user/signin-form.hbs')
})

router.get('/signup', (req, res, next) => {
	res.render('user/signup-form.hbs')
})

router.post('/signup/profile', uploader.single('img_url'), (req, res, next) => {
	let {
		firstName,
		lastName,
		expertise,
		email,
		password,
		description,
		img_url,
	} = req.body
	let salt = bcrypt.genSaltSync(10)
	let hash = bcrypt.hashSync(password, salt)

	if (
		email == '' ||
		firstName == '' ||
		lastName == '' ||
		expertise == '' ||
		password == '' ||
		description == '' ||
		img_url == ''
	) {
		res.render('user/signup-form', {
			error: 'Please fill all field with accurate information to create an account',
		})
		return
	}

	let passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
	if (!passwordRegEx.test(password)) {
		res.render('user/signup-form.hbs', {
			error: 'Please enter a valid password: Minimum eight characters, at least one letter, one number and one upperCase and lowercase',
		})
		return
	}

	User.create({
		firstName,
		lastName,
		expertise,
		email,
		password: hash,
		description,
		img_url: req.file.path,
	})
		.then((user) => {
			res.render('user/user-profile', { user })
		})
		.catch((err) => {
			next(err)
		})
})

router.get('/:id/profile', (req, res, next) => {
	const { id } = req.params
	User.findById(id)
		.then((user) => {
			res.render('user/user-profile', { user })
		})
		.catch((err) => {
			next('user not found', err)
		})
})

router.post('/profile', (req, res, next) => {
	let { email, password } = req.body
	User.findOne({ email })
		.then((user) => {
			if (user) {
				let userObj = user
				let isMatching = bcrypt.compareSync(password, userObj.password)

				if (isMatching) {
					req.session.myProperty = userObj
					res.render('user/user-profile', { user })
				} else {
					res.render('user/signin-form.hbs', {
						error: 'Password incorrect, Please try again',
					})
					return
				}
			} else {
				res.render('user/signin-form.hbs', { error: 'user not found' })
				return
			}
		})
		.catch((err) => {
			next(err)
		})
})

router.get('/logout', (req, res, next) => {
	req.session.destroy()
	res.redirect('/signin')
})

router.get('/:id/edit', (req, res, next) => {
	const { id } = req.params
	User.findById(id)
		.then((user) => {
			res.render('user/edit-profile.hbs', { user })
		})
		.catch(() => {
			next('failed to edit the profile')
		})
})

//Update information/ Edit profile
router.post('/:id/profile', (req, res, next) => {
	const { firstName, lastName, expertise, email, description, img_url } =
		req.body
	const { id } = req.params
	User.findByIdAndUpdate(
		id,
		{
			firstName,
			lastName,
			expertise,
			email,
			description,
			img_url,
		},
		{ new: true },
	)
		.then((user) => {
			res.render('user/user-profile', { user })
		})
		.catch((err) => {
			next('Failed to update your profile', err)
		})
})

//Google auth
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		],
	}),
)
router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/', // here you would redirect to the login page using traditional login approach
	}),
)

module.exports = router
