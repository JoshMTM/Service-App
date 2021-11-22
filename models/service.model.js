const { Schema, model } = require('mongoose')

const ServiceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
	},
	price: {
		type: Number,
		required: true,
	},
	photos: {
		type: String,
	},

	requesters: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	//
})

const Service = model('Service', ServiceSchema)

module.exports = Service
