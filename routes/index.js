const router = require('express').Router()
const Service = require('../models/service.model')

/* GET home page */
router.get('/', (req, res, next) => {
	Service.find()
		.then((services) => {
			const sortdServices = services.sort((a, b) => a - b)
			sortdServices.length = Math.min(services.length, 3)
			// services.splice(services.length - 3)
			res.render('index', { sortdServices })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = router
