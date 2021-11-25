// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config')

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs')
hbs.registerPartials('views' + '/partials')

const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

// default value for title local
const projectName = 'handeeApp'
const capitalized = (string) =>
	string[0].toUpperCase() + string.slice(1).toLowerCase()

app.locals.title = `${capitalized(projectName)} created with IronLauncher`

const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 24 * 60 * 60, // your cookie will be cleared after these seconds
		},
		store: MongoStore.create({
			mongoUrl:
				process.env.MONGODB_URI || 'mongodb://localhost/handeeApp',
			// Time to Live for sessions in DB. After that time it will delete it!
			ttl: 24 * 60 * 60, // your session will be cleared after these seconds
		}),
	}),
)

//Passport session

const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('./models/user.model.js')

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => cb(null, user._id))

passport.deserializeUser((id, cb) => {
	User.findById(id)
		.then((user) => cb(null, user))
		.catch((err) => cb(err))
})

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done) => {
			// to see the structure of the data in received response:
			console.log('Google account details:', profile)

			User.findOne({ googleID: profile.id })
				.then((user) => {
					if (user) {
						done(null, user)
						return
					}

					User.create({
						googleID: profile.id,
						firstName: profile.name.givenName,
						img_url: profile.photos[0].value,
					})
						.then((newUser) => {
							done(null, newUser)
						})
						.catch((err) => done(err)) // closes User.create()
				})
				.catch((err) => done(err)) // closes User.findOne()
		},
	),
)
// 👇 Start handling routes here
const index = require('./routes/index')
app.use('/', index)

const userRoutes = require('./routes/user.routes')
app.use('/', userRoutes)

const serviceRoutes = require('./routes/service.routes')
app.use('/', serviceRoutes)

const requestRoutes = require('./routes/request.routes')
app.use('/', requestRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app
