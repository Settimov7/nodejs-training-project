const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
	auth: {
		api_key: process.env.SEND_GRID_API_KEY,
	}
}));

exports.getLogin = (request, response) => {
	let errorMessage = request.flash('error');
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}

	response.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMessage,
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (request, response, next) => {
	const { email, password } = request.body;

	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(422).render('auth/login', {
			pageTitle: 'Login',
			path: '/login',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email,
				password,
			},
			validationErrors: errors.array(),
		});
	}

	User.findOne({ email })
	.then((user) => {
		if (!user) {
			return response.status(422).render('auth/login', {
				pageTitle: 'Login',
				path: '/login',
				errorMessage: 'Invalid email.',
				oldInput: {
					email,
					password,
				},
				validationErrors: [{ param: 'email' }],
			});
		}

		bcrypt.compare(password, user.password)
		.then((doMatch) => {
			if (doMatch) {
				request.session.isLoggedIn = true;
				request.session.user = user;

				return request.session.save((error) => {
					console.log(error);

					response.redirect('/');
				});
			}

			return response.status(422).render('auth/login', {
				pageTitle: 'Login',
				path: '/login',
				errorMessage: 'Invalid password.',
				oldInput: {
					email,
					password,
				},
				validationErrors: [{ param: 'password' }],
			});
		})
		.catch((error) => {
			console.log(error);

			response.redirect('/login');
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postLogout = (request, response) => {
	request.session.destroy((error) => {
		console.log(error);

		response.redirect('/');
	});
};

exports.getSignUp = (request, response) => {
	let errorMessage = request.flash('error');
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}

	response.render('auth/signup', {
		pageTitle: 'Signup',
		path: '/signup',
		errorMessage,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postSignUp = (request, response, next) => {
	const { email, password, confirmPassword } = request.body;
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(422).render('auth/signup', {
			pageTitle: 'Signup',
			path: '/signup',
			errorMessage: errors.array()[0].msg,
			oldInput: {
				email,
				password,
				confirmPassword,
			},
			validationErrors: errors.array(),
		});
	}

	bcrypt.hash(password, 12)
	.then((hashedPassword) => {
		const newUser = new User({
			email,
			password: hashedPassword,
			cart: {
				items: [],
			},
		});

		return newUser.save();
	})
	.then(() => {
		response.redirect('/login');

		return transporter.sendMail({
			to: email,
			from: 'shop@node-complete.com',
			subject: 'Signup succeeded!',
			html: '<h1>You successfully signed up!</h1>'
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getReset = (request, response) => {
	let errorMessage = request.flash('error');
	if (errorMessage.length > 0) {
		errorMessage = errorMessage[0];
	} else {
		errorMessage = null;
	}

	response.render('auth/reset', {
		pageTitle: 'Reset Password',
		path: '/reset',
		errorMessage,
	});
};

exports.postReset = (request, response, next) => {
	crypto.randomBytes(32, (error, buffer) => {
		if (error) {
			console.log(error);

			return response.redirect('/reset');
		}

		const token = buffer.toString('hex');
		const { email } = request.body;

		User.findOne({ email })
		.then((user) => {
			if (!user) {
				request.flash('error', 'No account with that email found.');

				return response.redirect('/reset');
			}

			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;

			return user.save();
		})
		.then(() => {
			response.redirect('/');

			return transporter.sendMail({
				to: email,
				from: 'shop@node-complete.com',
				subject: 'Reset',
				html: `
					<p>You requested a password reset</p>
					<p>Click this <a href="http://localhost:3000/reset/${ token }">link</a> to set a new password.</p>
				`
			});
		})
		.catch((error) => {
			const productCreatingError = new Error(error);
			productCreatingError.httpStatusCode = 500;

			return next(productCreatingError);
		});
	});
};

exports.getNewPassword = (request, response) => {
	const token = request.params.token;

	User.findOne({
		resetToken: token,
		resetTokenExpiration: {
			$gt: Date.now(),
		}
	})
	.then((user) => {
		let errorMessage = request.flash('error');
		if (errorMessage.length > 0) {
			errorMessage = errorMessage[0];
		} else {
			errorMessage = null;
		}

		response.render('auth/new-password', {
			pageTitle: 'New Password',
			path: '/new-password',
			errorMessage,
			userId: user._id.toString(),
			passwordToken: token,
		});
	});
};

exports.postNewPassword = (request, response, next) => {
	const { password, userId, passwordToken } = request.body;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: {
			$gt: Date.now(),
		},
		_id: userId,
	})
	.then((user) => {
		resetUser = user;

		return bcrypt.hash(password, 12);
	})
	.then((password) => {
		resetUser.password = password;
		resetUser.resetToken = undefined;
		resetUser.resetTokenExpiration = undefined;

		return resetUser.save();
	})
	.then(() => {
		response.redirect('/login');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};