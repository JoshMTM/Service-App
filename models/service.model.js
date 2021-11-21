const { Schema, model } = require('mongoose')

const ServiceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	// time: {
	// 	type: Number,
	// 	required: true,
	// },
	description: {
		type: String,
		required: true,
	},
	// photos: [
	// 	{
	// 		url: String,
	// 	},
	// ],
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
