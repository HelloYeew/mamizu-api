const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Load up file helpers
const fs = require('fs')

// Using body parser as JSON parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes from routes folder
const routes = require('./routes/routes.js')(app, fs);

// Check database file availability
// TODO: Make this function to check all required files via env variables
if (fs.existsSync('./data/novel.json')) {
    console.log('Database file found');
} else {
    console.log('Database file not found, create a new one');
    // Create database file
    fs.writeFile('./data/novel.json', '{}', (err) => {
        if (err) throw err;
        console.log('Database file created');
    });
}

// Start server
const server = app.listen(parseInt(process.env.PORT), () => {
    console.log('listening on port %s...', server.address().port);
});