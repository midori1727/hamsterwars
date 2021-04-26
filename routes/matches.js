const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

// GET alla matches
router.get('/', async (req, res) => {

	try {
		const docRef = db.collection('matches');
		const snapShot = await docRef.get();
	
		if (snapShot.empty) {
			res.status(404).send('There are no matches!')
			return;
		};
		let allmatches = [];
		snapShot.forEach( doc => {
			const data = doc.data();
			data.id = doc.id;
			allmatches.push(data);
		});
		
		res.send(allmatches);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});

//GET match med ID
router.get('/:id', async (req, res) => {

	const id = req.params.id;

	try {
		const docRef = await db.collection('matches').doc(id).get();
	
		if(!docRef.exists) {
			res.status(404).send('match does not exist')
			return;
		}
	
		const data = docRef.data();
		res.send(data);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}

});

//POST matches 
router.post('/', async (req, res) => {

	const object = req.body;

	try {
		//kontrollera om hamster id finns i hamsterobjekt-listan
		winnerHamsterRef = await db.collection('hamsters').doc(object.winnerId).get();
		loserHamsterRef = await db.collection('hamsters').doc(object.loserId).get();

		if(!winnerHamsterRef.exists || !loserHamsterRef.exists){
			console.log('Winner hamster id or loser hamster id does not exist');
			res.sendStatus(400);
			return ;
		};

		// lägg till 1 på wins och games i hamster-objekt när det vinner
		const winnerHamsterData = winnerHamsterRef.data();
		winnerHamsterData.wins += 1;
		winnerHamsterData.games += 1;

		// lägg till 1 defeats och games i hamster-objekt när det förlorar
		const loserHamsterData = loserHamsterRef.data();
		loserHamsterData.defeats += 1;
		loserHamsterData.games += 1;
		
		await db.collection('hamsters').doc(object.winnerId).set(winnerHamsterData, { merge: true });
		await db.collection('hamsters').doc(object.loserId).set(loserHamsterData, { merge: true });
		
		const docRef = await db.collection('matches').add(object);
		res.send(`{ id: ${docRef.id} }`)
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}

});


//DELETE matches
router.delete('/:id', async (req, res) => {

	const id = req.params.id;

	try {
		const docRef = await db.collection('matches').doc(id).get();
	
		if(!docRef.exists) {
			res.sendStatus(400);
			return;
		}
		
		await db.collection('matches').doc(id).delete();
		res.sendStatus(200);
	}
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


module.exports = router;