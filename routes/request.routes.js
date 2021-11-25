const router = require('express').Router()
const Service = require('../models/Service.model')
const Request = require('../models/request.model')
const { sendMail } = require('../services/mail.service')

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
router.get('/requests/new/:idService', async (req, res, next) => {
	const { idService } = req.params
	const service = await Service.findById(idService)
		.populate('serviceProvider')
		.catch((err) => next(err))

	const { id, name } = service
	const { firstName, lastName } = service.serviceProvider
	res.render('requests/form', {
		service: { id, name },
		user: { id: req.session?.myProperty._id },
		firstName,
		lastName,
	})
})

// read request edit form

/*router.post('/send-email', (req, res, next) => {
	let { email, subject, message } = req.body
// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'your email address',
			pass: 'your email password',
		},
		tls: {
			rejectUnauthorized: false
		}
	})
	// send email with defined transport object
	transporter
		.sendMail({
			from: {{requester.email}},
			to: {{service.serviceProvider.email}},
			subject: 'Request for' {{service.name}},
			text: {{message}},
			html: `<b>${message}</b>`,
		})
		.then((info) =>
			res.render('message', { email, subject, message, info }),
		)
		.catch((error) => console.log(error))
})*/

// database routes:

// create requests
router.post('/api/requests', async (req, res, send) => {
	const requesterMail = req.session.myProperty.email
	const request = req.body
	await Request.create(request).catch((err) => next(err))

	const options = [
		request.service.name,
		request.message,
		requesterMail,
		request.email,
	]
	await sendMail(...options)
	res.redirect('/requests')
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
router.get('/api/requests/delete/id', async (req, res, next) => {
	const { id } = req.params
	await Request.findByIdAndDelete(id).catch((err) => next(err))
	res.redirect('/requests')
})

// email routes:

module.exports = router
