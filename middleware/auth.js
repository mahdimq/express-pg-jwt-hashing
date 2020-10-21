const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require('../expressError');

const authenticateJWT = (req, res, next) => {
	try {
		const payload = jwt.verify(req.body._token, SECRET_KEY);
		req.user = payload;
		console.log('YOU HAVE A VALID TOKEN HERE');
		return next();
	} catch (err) {
		return next();
	}
};

const ensureLoggedIn = (req, res, next) => {
	if (!req.user) {
		const err = new ExpressError('Unauthorized', 401);
		return next(err);
	} else {
		return next();
	}
};

const ensureIsAdmin = (req, res, next) => {
	if (!req.user || req.user.type !== 'admin') {
		return next(new ExpressError('Must be an admin to access this!', 401));
	}
	return next();
};

module.exports = { authenticateJWT, ensureLoggedIn, ensureIsAdmin };
