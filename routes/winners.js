const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//GET 5 winners från hamster-objekt 
router.get('/', async (req, res) => {

	try {
		let getHamsters = await db.collection('hamsters').orderBy('wins', 'desc').limit(5).get();
		const winningHamsters = [];
		getHamsters.forEach(doc => {
			winningHamsters.push(doc.data());
		});
	
		res.send(winningHamsters);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});

module.exports = router;
