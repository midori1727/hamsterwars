const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();


// ** REST API ** 

// GET alla hamsters
router.get('/', async (req, res) => {
	let allHamsters = [];

	try {
		const docRef = db.collection('hamsters');
		const snapShot = await docRef.get();

		if (snapShot.empty) {
			res.status(404).send('There are no hamsters!');
			return;
		};
		snapShot.forEach( doc => {
			const data = doc.data();
			data.id = doc.id;
			allHamsters.push(data);
		})
		res.send(allHamsters);
	}

	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


// GET random hamsteer
router.get('/random', async (req, res) => {
	let randomHamsters = [];

	try {
		const docRef = db.collection('hamsters');
		snapShot = await docRef.get();

		if (snapShot.empty) {
			res.status(404).send('There are nor hamsters!');
			return;
		};

		snapShot.forEach( doc => {
			const data = doc.data();
			data.id = doc.id;
			randomHamsters.push(data);
		});

		let randomIndex = Math.floor(Math.random()*randomHamsters.length);
		res.send(randomHamsters[randomIndex]);
	}

	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


//GET hamster med id
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const docRef = await db.collection('hamsters').doc(id).get();

		if (!docRef.exists) {
			res.status(404).send('Hamster does not exist');
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


// POST hamster        
router.post('/', async (req, res) => {
	const object = req.body;

	try {
		if(!isHamstersObject(object)) {
			res.sendStatus(400);
			return; 
		}

		const docRef = await db.collection('hamsters').add(object);
		const postedHamsterRef = await db.collection('hamsters').doc(docRef.id).get();
		const postedHamsterData = postedHamsterRef.data();
		res.send({ id: docRef.id,
			name: postedHamsterData.name,
			age: postedHamsterData.age,
			favFood: postedHamsterData.favFood,
			loves: postedHamsterData.loves,
			imgName: postedHamsterData.imgName,
			wins: postedHamsterData.wins,
			defeats: postedHamsterData.defeats,
			games: postedHamsterData.games});
	}

	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


// PUT hamster        
router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	try {
		const docRef =  db.collection('hamsters')
		const snapShot = await docRef.doc(id).get();
		
		if
		(!snapShot.exists) {
			res.status(404).send('This id does not exist: ' + id );
			return;
		}else if(!checkHamsterObject(object) || !Object.keys(object).length ){
			res.sendStatus(400);
			return;
		}
		
		await docRef.doc(id).set(object, { merge: true });
		res.sendStatus(200);
	}

	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});


// DELETE hamster    
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const docRef = await db.collection('hamsters').doc(id).get();

		if(!docRef.exists) {
			res.status(404).send('This id does not exist: ' + id );
			return;
		}

		await db.collection('hamsters').doc(id).delete();
		res.sendStatus(200);
	}

	catch(error) {
		console.log('An error occured!' + error.message);
		res.status(500).send(error.message);
	}
});

// validering

// validering för POST/hamsters
function isHamstersObject(hamsterObject){
	const digit = /^[0-9]+$/
	if
	(digit.test(hamsterObject.name) || 
	!hamsterObject.name || 
	!digit.test(hamsterObject.age) || 
	digit.test(hamsterObject.favFood) || 
	!hamsterObject.favFood || 
	digit.test(hamsterObject.loves) || 
	!hamsterObject.loves || 
	digit.test(hamsterObject.imgName) || 
	!hamsterObject.imgName || 
	!digit.test(hamsterObject.wins) ||
	!digit.test(hamsterObject.defeats) || 
	!digit.test(hamsterObject.games))
	{
		return false;
	}
		return true;
};


//validering för PUT/hamsters. Kontrollera key och type
function checkHamsterObject(hamsterObject) {
	const digit = /^[0-9]+$/
	for(property in hamsterObject){
		if(property === 'name' && digit.test(hamsterObject.name)){
			return false;
		} else if (property === 'age' && !digit.test(hamsterObject.age)){
			return false;
		} else if(property === 'favFood' && digit.test(hamsterObject.favFood)){
			return false;
		} else if(property === 'loves' && digit.test(hamsterObject.loves)){
			return false;
		} else if(property === 'imgName' && digit.test(hamsterObject.imgName)){
			return false;
 		} else if(property === 'wins' && !digit.test(hamsterObject.wins)){
			return false;
		} else if(property === 'defeats' && !digit.test(hamsterObject.defeats)){
			return false;
		} else if (property === 'games' && !digit.test(hamsterObject.games)){
			return false;
		}
		    return true;
	}
};

module.exports = router;