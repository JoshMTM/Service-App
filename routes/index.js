const router = require('express').Router()
const Service = require('../models/service.model')

/* GET home page */
router.get('/', (req, res, next) => {
	Service.find()
		.then((services) => {
			console.log(services)
			res.render('index', { services })
		})
		.catch((err) => {
			next(err)
		})
})

module.exports = router
