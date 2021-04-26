const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//GET 5 winners från hamster-objekt 
router.get('/', async (req, res) => {

	try {
		let getHamsters = await db.collection('hamsters').orderBy('wins', 'desc').limit(5).get();
		
		// Lägg till hamster-objekt som har vunnit minst en gång
		const winningHamsters = [];
		getHamsters.forEach(doc => {
			data = doc.data();
			if(data.wins > 0){
				winningHamsters.push(data);
			}
		});

		res.send(winningHamsters);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});

module.exports = router;
