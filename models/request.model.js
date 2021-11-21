const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	status: ['pending', 'inProgress', 'declined', 'completed'],

	serviceId: {
		type: Schema.Types.ObjectId,
		ref: 'Service',
	},
})

const Request = mongoose.model('Request', RequestSchema)

module.exports = Request
