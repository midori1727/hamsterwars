const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const hamsters = require('./routes/hamsters.js');
const matches = require('./routes/matches.js');
const matchWinners = require('./routes/matchWinners.js');
const winners = require('./routes/winners.js');
const losers = require('./routes/losers.js');

const PORT = process.env.PORT || 2000;
const staticFolder = path.join(__dirname, 'public');
const imgFolder = path.join(__dirname, 'img');

//Middleware

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});

app.use( express.json() );
app.use( cors() );
app.use( express.static(staticFolder) );
app.use('/img', express.static(imgFolder) );



//Routes

app.use('/hamsters', hamsters);
app.use('/matches', matches);
app.use('/matchWinners', matchWinners);
app.use('/winners', winners);
app.use('/losers', losers);


//Starta servern
app.listen(PORT, () => {
	console.log('Server in listening on port ' + PORT);
})