const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // file helper
const logger = require('./log')

require('dotenv').config();

// Load up app and routes
const app = express();
const routes = require('./routes/routes.js')(app, fs);

// Using body parser as JSON parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start server
const server = app.listen(parseInt(process.env.PORT), () => {
    logger.info('Server started on port ' + process.env.PORT);
});