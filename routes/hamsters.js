const express = require('express');
const router = express.Router();
const getDatabase = require('../database.js');
const db = getDatabase();


// Get alla hamsters
router.get('/', (req, res) => {
	res.send('/hamster REST API')
});




module.exports = router;