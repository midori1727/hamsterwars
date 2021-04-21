const express = require('express');
const app = express();
const cors = require('cors');
const hamsters = require('./routes/hamsters.js');
const matches = require('./routes/matches.js');
const path = require('path')

const PORT = 2000;
const staticFolder = path.join(__dirname, 'public')

//Middleware

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});

app.use( express.json() );
app.use( cors() );
app.use( express.static(staticFolder) )



//Routes

app.use('/hamsters', hamsters);
app.use('/matches', matches);


//Starta servern
app.listen(PORT, () => {
	console.log('Server in listening on port ' + PORT);
})