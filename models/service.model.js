const { Schema, model } = require('mongoose')
const User = require('./user.model')

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
