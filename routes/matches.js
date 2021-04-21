const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

// GET alla matches
router.get('/', async (req, res) => {
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
});

//GET match med ID
router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = await db.collection('matches').doc(id).get();

	if(!docRef.exists) {
		res.status(404).send('match does not exist')
		return;
	}

	const data = docRef.data();
	res.send(data);
});

//POST matches 
router.post('/', async (req, res) => {
	const object = req.body;

	if(!object || !object.winnerId || !object.loserId){
		res.sendStatus(400);
		return 
	}
	const docRef = await db.collection('matches').add(object);
	res.send(docRef.id);
});


//DELETE matches
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	const docRef = db.collection('matches');
	const snapShot = await docRef.get();
	
	let existingId = false;
	snapShot.forEach( doc => {
    	const data = doc.data();
		data.id = doc.id;
		if(id === data.id) {
			existingId = true;
		}
	});

	if(!existingId) {
		res.sendStatus(400);
		return;
	}
	
	await db.collection('matches').doc(id).delete();
	res.sendStatus(200);
});


//GET alla matches som hamstern med id har vunnit   /matchWinners/:id
//GET 5 winners  /winners
//get 5 losers   /losers





module.exports = router;