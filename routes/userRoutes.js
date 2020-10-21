const express = require('express');
const router = new express.Router();
const db = require('../db');

// GET ALL
router.get('/', async (req, res, next) => {
	try {
		const result = await db.query('SELECT * FROM users');
		return res.json(result.rows);
	} catch (err) {
		return next(err);
	}
});

// GET ONE BY SEARCH
router.get('/search', async (req, res, next) => {
	try {
		const { type } = req.query;
		const result = await db.query('SELECT * FROM users WHERE type=$1', [type]);
		return res.json(result.rows);
	} catch (err) {
		return next(err);
	}
});

// POST
router.post('/', async (req, res, next) => {
	try {
		const { name, type } = req.body;
		const result = await db.query(
			`INSERT INTO users (name, type) VALUES ($1, $2) RETURNING id, name, type`,
			[name, type]
		);
		return res.status(201).json(result.rows);
	} catch (err) {
		return next(err);
	}
});

// UPDATE ONE
router.patch('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, type } = req.body;

		const result = await db.query(
			'UPDATE users SET name=$1, type=$2 WHERE id=$3 RETURNING id, name, type',
			[name, type, id]
		);
		return res.send(result.rows[0]);
	} catch (err) {
		return next(err);
	}
});

// DELETE ONE
router.delete('/:id', async (req, res, next) => {
	try {
		const result = await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
		return res.json({ message: 'Deleted' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
