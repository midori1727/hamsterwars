const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//get 5 losers från hamster-objekt 
router.get('/', async (req, res) => {

	try {
		let getHamsters = await db.collection('hamsters').orderBy('defeats', 'desc').limit(5).get();

		// Lägg till hamster-objekt som har förlorat minst en gång
		const losingHamsters = [];
		getHamsters.forEach(doc => {
			data = doc.data();
			if(data.defeats > 0){
				losingHamsters.push(data);
			}
		});
	
		res.send(losingHamsters);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});

module.exports = router;