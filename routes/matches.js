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
			res.status(404).send('match does not exist');
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
			return;
		};

		//Lägg till 1 på wins och games i hamster-objekt när det vinner
		const winnerHamsterData = winnerHamsterRef.data();
		winnerHamsterData.wins += 1;
		winnerHamsterData.games += 1;

		//Lägg till 1 på defeats och games i hamster-objekt när det förlorar
		const loserHamsterData = loserHamsterRef.data();
		loserHamsterData.defeats += 1;
		loserHamsterData.games += 1;

		await db.collection('hamsters').doc(object.winnerId).set(winnerHamsterData, { merge: true });
		await db.collection('hamsters').doc(object.loserId).set(loserHamsterData, { merge: true });
		
		//Post match data till match collection
		const docRef = await db.collection('matches').add(object);
		//Hämta skapande match data
		const matchRef = await db.collection('matches').doc(docRef.id).get();
		const matchData = matchRef.data();

		res.send({ id: docRef.id,
					  winnerId: matchData.winnerId,
					  loserId: matchData.loserId 
					});
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
			res.sendStatus(404);
			return;
		};

		//Hämta winner och loser hamstersid
		const matchData = docRef.data();
		const winnerHamsterId = matchData.winnerId;
		const loserHamsterId = matchData.loserId;
		winnerHamsterRef = await db.collection('hamsters').doc(winnerHamsterId).get();
		loserHamsterRef = await db.collection('hamsters').doc(loserHamsterId).get();

		//Ta bort 1 på wins och games i winner-hamster-objekt 
		const winnerHamsterData = winnerHamsterRef.data();
		winnerHamsterData.wins -= 1;
		winnerHamsterData.games -= 1;

		//Ta bort 1 på defeats och games i loser-hamster-objekt 
		const loserHamsterData = loserHamsterRef.data();
		loserHamsterData.defeats -= 1;
		loserHamsterData.games -= 1;

		//Ändra winner och loser hamster data(ta bort 1)
		await db.collection('hamsters').doc(winnerHamsterId).set(winnerHamsterData, { merge: true });
		await db.collection('hamsters').doc(loserHamsterId).set(loserHamsterData, { merge: true });
		
		await db.collection('matches').doc(id).delete();
		res.sendStatus(200);
	}
	
	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


module.exports = router;