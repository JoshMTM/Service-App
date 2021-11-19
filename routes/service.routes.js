const router = require('express').Router()
const Service = require('../models/service.model')

// View routes:

// Services list (read)
router.get('/services', (req, res, next) => {
	Service.find()
		.populate('requesters')
		.then((services) => {
			res.render('services/list', { services })
		})
		.catch((err) => next(err))
})

// Services new form (read)
router.get('/services/new', (req, res, next) => {
	Service.find()
		.then((services) => {
			console.log(services)
			res.render('services/new', { services })
		})
		.catch((err) => next(err))
})

// Database routes:

// Service Create
router.post('/services', (req, res, next) => {
	const service = req.body
	Service.create()
		.then((service) => {
			res.redirect('/services')
		})
		.catch((err) => next(err))
})

// Service Update
router.post('/services/save/:id', (req, res, next) => {
	const id = req.params.id
	const movie = req.body
	Service.findByIdAndUpdate().then((movie) => {
		res.redirect('services').catch((err) => next(err))
	})
})

// Delete Service
router.get('/services/delete/:id', (req, res, next) => {
	const id = req.params.id
	Service.findByIdAndDelete()
		.then(() => {
			res.redirect('/services')
		})
		.catch((err) => next(err))
})

module.exports = router
