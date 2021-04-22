const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();


//GET alla matches som hamstern med id har vunnit   /matchWinners/:id
router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const docRef = db.collection('matches').where('winnerId', '==', id )
	const winnerHamster = await docRef.get();

	//もしidがなかった時の対処のIF文の書き方を確認
	if(winnerHamster.empty) {
		res.status(404).send('can not find winning matches');
		return;
	}
	let winningAllMatches = [];
	winnerHamster.forEach( doc => {
		const data = doc.data();
		data.id = doc.id;
		winningAllMatches.push(data);
	});
	res.send(winningAllMatches);
	
});

module.exports = router;