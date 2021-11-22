const router = require('express').Router()
const Service = require('../models/Service.model')

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
			res.render('services/form', { services })
		})
		.catch((err) => next(err))
})

// Services read detail (read)
router.get('/services/:id', (req, res, next) => {
	const id = req.params.id
	Service.findById(id)
		.then((service) => res.render('services/detail', { service }))
		.catch((err) => next(err))
})

// Services edit form (read)
router.get('/services/edit/:id', (req, res, next) => {
	const id = req.params.id
	Service.findById(id)
		.then((service) => res.render('services/form', { service }))
		.catch((err) => next(err))
})

// Database routes:

// Service Create
router.post('/api/services', (req, res, next) => {
	const service = req.body
	Service.create(service)
		.then(() => res.redirect('/services'))
		.catch((err) => next(err))
})

// Service Update
router.post('/api/services/:id', (req, res, next) => {
	const id = req.params.id
	const service = req.body
	Service.findByIdAndUpdate(id, service)
		.then(() => res.redirect('/services/' + id))
		.catch((err) => next(err))
})

// Delete Service
router.get('/api/services/delete/:id', (req, res, next) => {
	const id = req.params.id
	Service.findByIdAndDelete(id)
		.then(() => res.redirect('/services'))
		.catch((err) => next(err))
})

module.exports = router
