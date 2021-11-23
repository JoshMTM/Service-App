const { Schema, model } = require('mongoose')

const RequestSchema = new Schema({
	service: {
		type: Schema.Types.ObjectId,
		ref: 'Service',
	},
	date: {
		type: Date,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},

	status: ['requested', 'pending', 'inProgress', 'declined', 'completed'],

	requester: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
})

const Request = model('Request', RequestSchema)
module.exports = Request
