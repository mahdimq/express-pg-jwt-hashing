const express = require('express');
const router = new express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const ExpressError = require('../expressError');
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');
const { authenticateJWT, ensureLoggedIn, ensureIsAdmin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
	try {
		const result = await db.query('SELECT * FROM users');
		return res.json(result.rows);
	} catch (err) {
		return next(err);
	}
});

// SIGNUP ROUTE
router.post('/register', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			throw new ExpressError('Username and Password required', 400);
		}
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username`,
			[username, hashedPassword]
		);
		return res.json(result.rows[0]);
	} catch (err) {
		if (err.code === '23505') {
			return next(new ExpressError('Username taken, please pick another', 400));
		}
		return next(err);
	}
});

// LOGIN ROUTE
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			throw new ExpressError('Username and Password required', 400);
		}
		const result = await db.query(
			`SELECT username, password
			 FROM users
			 WHERE username=$1`,
			[username]
		);
		const user = result.rows[0];
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				const token = jwt.sign({ username }, SECRET_KEY);
				return res.json({ message: 'Logged In!', token });
			}
		}
		throw new ExpressError('Invalid username/password!', 400);
	} catch (err) {
		return next(err);
	}
});

// PROTECTED ROUTE
router.get('/topsecret', ensureLoggedIn, (req, res, next) => {
	try {
		return res.json({ message: 'SIGNED IN! THIS IS TOP SECRET!!' });
	} catch (err) {
		return next(new ExpressError('Please login first', 401));
	}
});

// PRIVATE ROUTE
router.get('/private', ensureLoggedIn, (req, res, next) => {
	res.json({ message: `Welcome to my private colletion, ${req.user.username}` });
});

// ADMIN ROUTE
router.get('/admin', ensureIsAdmin, (req, res, next) => {
	res.json({ message: `This is the ADMIN Section, ${req.user.username}` });
});

module.exports = router;
