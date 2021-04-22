const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();


// ** REST API ** 

// Get alla hamsters
router.get('/', async (req, res) => {
	const docRef = db.collection('hamsters');
	const snapShot = await docRef.get();

	if (snapShot.empty) {
		res.status(404).send('There are no hamsters!')
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


// Get random hamster 
router.get('/random', async (req, res) => {
	const docRef = db.collection('hamsters');
	const snapShot = await docRef.get();

	if (snapShot.empty) {
		res.status(404).send('There are no hamsters!')
		return;
	};

	let randomHamsters = [];
	snapShot.forEach( doc => {
		const data = doc.data();
		data.id = doc.id;
		randomHamsters.push(data);
	});
	
	let randomIndex = Math.floor(Math.random()*randomHamsters.length);
	res.send(randomHamsters[randomIndex]);
});


// Get hamster med ID
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


// POST hamsters        
router.post('/', async (req, res) => {
	const object = req.body;

	if(!isHamstersObject(object)) {
		res.sendStatus(400);
		return;
	}

	const docRef = await db.collection('hamsters').add(object);
	res.send(docRef.id)
});


// PUT hamster        
router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	const docRef = db.collection('hamsters');
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
		res.status(404).send('This id does not exist: ' + id );
		return;
	} else if(!object) {
		res.sendStatus(400);
		return;
	}
	
	await docRef.doc(id).set(object, { merge: true });
	res.sendStatus(200);
});


// DELETE hamster    
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	const hamstrRef = db.collection('hamsters');
	const snapShot = await hamstrRef.get();

	let existingId = false;
	snapShot.forEach( doc => {
    	const data = doc.data();
		data.id = doc.id;
		if(id === data.id) {
			existingId = true;
		}
	});

	if(!existingId) {
		res.status(404).send('This id does not exist: ' + id );
		return;
	}
	if(!id) {
		res.sendStatus(400);
		return;
	}
	await db.collection('hamsters').doc(id).delete();
	res.sendStatus(200);
})

// validering
function isHamstersObject(hamsterObject) {
	if (!hamsterObject) {
		return false;
	} else if (!hamsterObject.name || !hamsterObject.age || !hamsterObject.favFood || !hamsterObject.loves || !hamsterObject.imgName) {
		return false;
	} else if (!hamsterObject.wins || !hamsterObject.defeats || !hamsterObject.games) {
		return false;
	}
		return true;
}

module.exports = router;