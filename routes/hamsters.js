const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();


// ** REST API ** 

// Get alla hamsters

router.get('/', async (req, res) => {
	const hamstersRef = db.collection('hamsters');
	const snapShot = await hamstersRef.get();

	if (snapShot.empty) {
		res.send([]);
		return;
	};
	let allHamsters = [];
	snapShot.forEach( doc => {
		const data = doc.data();
		data.id = doc.id;
		allHamsters.push(data);
	});
	res.send(allHamsters);
});

// Get random hamsters  /hamsters/random

router.get('/random', async (req, res) => {
	const hamstersRef = db.collection('hamsters');
	const snapShot = await hamstersRef.get();

	if (snapShot.empty) {
		res.send([]);
		return;
	};
	let allHamsters = [];
	snapShot.forEach( doc => {
		const data = doc.data();
		data.id = doc.id;
		allHamsters.push(data);
	});
	let random = Math.floor(Math.random()*allHamsters.length);
	console.log('index is ' + random);
	console.log(allHamsters[random]);
	res.send(allHamsters[random]);
});


// Get hamsters med ID  /hamsters/:id

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = await db.collection('hamsters').doc(id).get();

	if(!docRef.exists) {
		res.status(404).send('Hamster does not exist')
		return;
	}

	const data = docRef.data();
	res.send(data);

});
// POST hamsters        /hamsters

router.post('/', async (req, res) => {
	const object = req.body;

	if
	// (!object || !object.name || !object.age || !object.favFood || !object.loves || !object.imgName || !object.wins || !object.defeats || !object.games)
	(!object) {
		res.sendStatus(400);
		return;
	}

	const docRef = await db.collection('hamsters').add(object);
	res.send(docRef.id)
});


// PUT hamsters         /hamsters/:id
// DELETE hamsters      /hamsters/:id



module.exports = router;