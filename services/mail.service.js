const nodemailer = require('nodemailer')

async function sendMail(
	serviceName,
	message,
	requesterEmail,
	serviceProviderEmail,
) {
	const testAccount = await nodemailer.createTestAccount()

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass, // generated ethereal password
		},
	})

	const options = {
		from: requesterEmail,
		to: serviceProviderEmail,
		subject: `Request for "${serviceName}"`,
		text: `You have received a request.\n\n${message}`,
	}

	// send mail with defined transport object
	let info = await transporter.sendMail(options)

	console.log('Message sent: %s', info.messageId)
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { sendMail }
