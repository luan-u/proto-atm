// load up the express framework and body-parser helper
const express = require('express');

// create an instance of express to serve our end points
const app = express();

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(express.json());

const routes = require('./src/routes/routes.js')(app);

app.listen(3333);
