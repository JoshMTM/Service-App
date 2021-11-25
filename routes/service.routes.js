const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const Service = require('../models/Service.model')

const pathUploads = path.join(__dirname, '../uploads')
const upload = multer({ dest: pathUploads })

// View routes:

// Services list (read)
router.get('/services', (req, res, next) => {
	console.log('test')
	Service.find()
		.populate('requesters')
		.populate('serviceProvider')
		.then((services) => res.render('services/list', { services }))
		.catch((err) => next(err))
})

// Services new form (read)
router.get('/services/new', (req, res, next) => {
	res.render('services/form')
})

// Services read detail (read)
router.get('/services/:id', (req, res, next) => {
	const id = req.params.id
	const user = req.session?.myProperty

	Service.findById(id)
		.populate('serviceProvider')
		.then((service) => {
			const isServiceProvider = user?._id == service.serviceProvider._id
			const { firstName, lastName } = service.serviceProvider
			res.render('services/detail', {
				service,
				isServiceProvider,
				firstName,
				lastName,
			})
		})
		.catch((err) => next(err))
})

// Services edit form (read)
router.get('/services/edit/:id', (req, res, next) => {
	const id = req.params.id
	Service.findById(id)
		.then((service) => res.render('services/form', { service }))
		.catch((err) => next(err))
})

// Image download (read)
router.get('/services/images/:filename', (req, res, next) => {
	const filename = req.params.filename
	const filepath = path.join(pathUploads, filename)
	res.sendFile(filepath, { headers: { 'content-type': 'image/png' } })
})

// Database routes:

// Service Create
router.post(
	'/api/services',
	upload.single('serviceImage'),
	(req, res, next) => {
		const service = req.body
		service.serviceImage = req.file
		service.serviceProvider = req.session.myProperty._id

		Service.create(service)
			.then(() => res.redirect('/services'))
			.catch((err) => next(err))
	},
)
// Service Update
router.post(
	'/api/services/:id',
	upload.single('serviceImage'),
	(req, res, next) => {
		const id = req.params.id
		const service = req.body
		console.log(service)
		Service.findByIdAndUpdate(id, service)
			.then(() => res.redirect('/services/' + id))
			.catch((err) => next(err))
	},
)

// Delete Service
router.get('/api/services/delete/:id', (req, res, next) => {
	const id = req.params.id
	Service.findByIdAndDelete(id)
		.then(() => res.redirect('/services'))
		.catch((err) => next(err))
})

module.exports = router
