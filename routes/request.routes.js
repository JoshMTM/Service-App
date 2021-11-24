const router = require('express').Router()
const Service = require('../models/Service.model')
const Request = require('../models/request.model')

// view routes:

// read all requests
router.get('/requests', (req, res, next) => {
	Request.find({ requester: req.session?.myProperty?._id })
		.populate('service')
		.populate('requester')
		.then((requests) => res.render('requests/list', { requests }))
		.catch((err) => next(err))
})

// read request new form
router.get('/requests/new/:idService', (req, res, next) => {
	const { idService } = req.params
	Service.findById(idService)
		.then((service) => {
			const { id, name } = service
			res.render('requests/form', {
				service: { id, name },
				user: { id: req.session.myProperty._id },
			})
		})
		.catch((err) => next(err))
})
// read request edit form

// database routes:

// create requests
router.post('/api/requests', (req, res, send) => {
	const request = req.body
	Request.create(request)
		.then(() => res.redirect('/requests'))
		.catch((err) => next(err))
})

// update requests
router.post('/api/requests/:id', (req, res, next) => {
	const id = req.params.id
	const request = req.body
	Request.findByIdAndUpdate(id, request)
		.then(() => res.redirect('/requests/' + id))
		.catch((err) => next(err))
})

// delete requests
router.get('/requests/delete/id', (req, res, send) => {
	const { id } = req.params
	Request.findByIdAndDelete(id)
		.then(() => {
			res.redirect('/requests')
		})
		.catch((err) => next(err))
})

module.exports = router
