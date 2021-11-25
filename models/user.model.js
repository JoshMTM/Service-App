const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	firstName: String,
	lastName: String,
	expertise: String,
	email: String,
	password: String,
	description: String,
	img_url: String,
	userServices: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Service',
		},
	],
	userRequests: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Request',
		},
	],
	googleID: String,
})

const User = model('User', userSchema)

module.exports = User
