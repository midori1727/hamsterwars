const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//get 5 losers hamsters objekt   /losers
router.get('/', async (req, res) => {
	let getHamsters = await db.collection('hamsters').orderBy('defeats', 'desc').limit(5).get();
	const losingHamsters = [];
	getHamsters.forEach(doc => {
		losingHamsters.push(doc.data());
	});

	res.send(losingHamsters);
});

module.exports = router;