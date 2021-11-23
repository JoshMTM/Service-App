const { Schema, model } = require('mongoose')

const ServiceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	// Adding a Service Provider to the Schema
	serviceProvider: {
		type: Schema.Types.ObjectId,
		ref: 'User',
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
	serviceImage: {
		originalname: String,
		encoding: String,
		mimetype: String,
		filename: String,
		size: Number,
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
