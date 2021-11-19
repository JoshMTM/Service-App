const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	pending_approval: {
		type: Boolean,
		default: false,
	},
	status: ['pending approval', 'taken into work', 'declined', 'completed'],

	service_Id: {
		type: Schema.Types.ObjectId,
		ref: 'Service',
	},
})

const Request = mongoose.model('Request', RequestSchema)

module.exports = Request
