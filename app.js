const express = require('express');
const app = express();
const morgan = require('morgan');
const ExpressError = require('./expressError');
const catRoutes = require('./routes/catRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const { authenticateJWT } = require('./middleware/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);
app.use(morgan('dev'));

app.use('/cats', catRoutes);
app.use('/users', userRoutes);
app.use('/', authRoutes);

// CUSTOM 404 NOT FOUND ERROR
app.use((req, res, next) => {
	const err = new ExpressError('Page not found', 404);
	return next(err);
});

// CUSTOM ERROR HANDLING
app.use((error, req, res, next) => {
	// set default status to 500 Internal Server Error
	const status = error.status || 500;
	const message = error.message;
	// display error and alert user
	res.status(status).json({ error: { message, status } });
});

module.exports = app;
