const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();


//GET 5 winners hamsters objekt  /winners
router.get('/', async (req, res) => {
	let getHamsters = await db.collection('hamsters').orderBy('wins', 'desc').limit(5).get();
	const winningHamsters = [];
	getHamsters.forEach(doc => {
		winningHamsters.push(doc.data());
	});

	res.send(winningHamsters);
});

module.exports = router;
