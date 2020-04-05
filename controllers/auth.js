const bcrypt = require('bcryptjs');

const User = require('../models/user');

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
	});
};

exports.postLogin = (request, response) => {
	const { email, password } = request.body;

	User.findOne({ email })
	.then((user) => {
		if (!user) {
			request.flash('error', 'Invalid email.');

			return response.redirect('/login');
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

			request.flash('error', 'Invalid password.');

			response.redirect('/login');
		})
		.catch((error) => {
			console.log(error);

			response.redirect('/login');
		});
	})
	.catch((error) => console.log(error));
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
	});
};

exports.postSignUp = (request, response) => {
	const { email, password, confirmPassword } = request.body;

	User.findOne({ email })
	.then((user) => {
		if (user) {
			request.flash('error', 'Email exists already, please pick a different one.');

			return response.redirect('/signup');
		}

		return bcrypt.hash(password, 12)
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
		});
	})
	.catch((error) => console.log(error));
};