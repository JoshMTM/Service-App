const router = require('express').Router()
const Service = require('../models/service.model')

/* GET home page */
router.get('/', (req, res, next) => {
	Service.find()
		.then((services) => {
			// const sortdServices = services.sort((a, b) => b - a)
			// sortdServices.length = Math.min(services.length, 3)
			const elem = services.slice(-3)
			res.render('index', { services: elem })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = router
