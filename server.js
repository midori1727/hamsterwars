const express = require('express');
const app = express();
const cors = require('cors');
const hamsters = require('./routes/hamsters.js');

const PORT = 2000;

//Middleware

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.params);
	next();
});

app.use( express.json() );
app.use( cors() );



//Routes

app.use('/', hamsters);


//Starta servern
app.listen(PORT, () => {
	console.log('Server in listening on port ' + PORT);
})