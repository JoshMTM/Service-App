const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const Service = require('../models/Service.model')

const pathUploads = path.join(__dirname, '../uploads')
const upload = multer({ dest: pathUploads })

// Defining the storage
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, './uploads/')
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, new Date().toISOString() + file.originalname)
// 	},
// })

//Filtering the files
// const fileFilter = (req, file, cb) => {
// 	// rejecting a file
// 	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
// 		cb(null, true)
// 	} else {
// 		cb(null, false)
// 	}
// }

// Executing multer and giving a destination to store files
// const upload = multer({
// 	storage: storage,
// 	limits: {
// 		fileSize: 1024 * 1024 * 5,
// 	},
// 	fileFilter: fileFilter,
// })

// View routes:

// Services list (read)
router.get('/services', (req, res, next) => {
	Service.find()
		.populate('requesters')
		.populate('serviceProvider')
		.then((services) => {
			res.render('services/list', {
				services,
				/*	firstName: service.serviceProvider.firstName,
				lastName: service.serviceProvider.lastName,*/
			})
		})
		.catch((err) => next(err))
})

// Services new form (read)
router.get('/services/new', (req, res, next) => {
	Service.find()
		.then((services) => {
			//console.log(services)
			res.render('services/form', { services })
		})
		.catch((err) => next(err))
})

// Services read detail (read)
router.get('/services/:id', (req, res, next) => {
	const id = req.params.id
	// How do we call the user, who is logged in?
	const user = req.session.myProperty

	Service.findById(id)
		.populate('serviceProvider')
		.then((service) => {
			console.log('user ', user._id)
			console.log('service ', service.serviceProvider)
			let isServiceProvider = user._id == service.serviceProvider._id
			res.render('services/detail', {
				service,
				isServiceProvider,
				firstName: service.serviceProvider.firstName,
				lastName: service.serviceProvider.lastName,
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
