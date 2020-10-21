const express = require('express');
const router = new express.Router();
const cats = require('../fakeDB');
const ExpressError = require('../expressError');

// GET ALL
router.get('/', (req, res) => {
	return res.json({ cats });
});

// POST
router.post('/', (req, res) => {
	const newCat = { name: req.body.name };
	cats.push(newCat);
	return res.status(201).json({ cat: newCat });
});

// GET ONE
router.get('/:name', (req, res, next) => {
	const foundCat = cats.find((cat) => cat.name === req.params.name);
	if (!foundCat) throw new ExpressError('Cat not found', 404);
	return res.json({ cat: foundCat });
});

// UPDATE ONE
router.patch('/:name', (req, res) => {
	const foundCat = cats.find((cat) => cat.name === req.params.name);
	if (foundCat === undefined) {
		throw new ExpressError('Cat not found', 404);
	}
	foundCat.name = req.body.name;
	return res.json({ cat: foundCat });
});

// DELETE ONE
router.delete('/:name', (req, res) => {
	const foundCat = cats.find((cat) => cat.name === req.params.name);
	if (foundCat === -1) {
		throw new ExpressError('Cat not found', 404);
	}
	cats.splice(foundCat, 1);
	return res.json({ message: 'Deleted' });
});

module.exports = router;
