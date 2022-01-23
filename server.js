const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Load up file helpers
const fs = require('fs')

// Using body parser as JSON parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes from routes folder
const routes = require('./routes/routes.js')(app, fs);

// Start server
const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});