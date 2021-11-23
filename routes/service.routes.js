const router = require('express').Router()
const Service = require('../models/Service.model')
// Multer Package
const multer = require('multer')

// Defining the storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname)
	},
})
//Filtering the files
const fileFilter = (req, file, cb) => {
	// rejecting a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		cb(null, false)
	}
}

// Executing multer and giving a destination to store files
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
})

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
router.get('/:id/services/new', (req, res, next) => {
	const { id } = req.params
	Service.find()
		.then(() => {
			res.render('services/new')
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
router.post(
	'/api/services',
	upload.single('serviceImage'),
	(req, res, next) => {
		serviceImage = req.file.path
		const service = req.body
		//adding the service image

		Service.create(service)
			.then(() => res.redirect('/services'))
			.catch((err) => next(err))
	},
)

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
