const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	time: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	photos: [
		{
			url: String,
			required: true,
		},
	],
	// The problem with the users: requesters/customers and providers/workers
	requesters: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	//
})

const Service = mongoose.model('Service', ServiceSchema)

module.exports = Service
