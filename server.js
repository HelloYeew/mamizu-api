const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const winston = require('winston');
const fs = require('fs'); // file helper
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

require('dotenv').config();

// Load up app and routes
const app = express();
const routes = require('./routes/routes.js')(app, fs);

// Using body parser as JSON parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ level: 'debug', filename: './log/debug.log' }),
        new winston.transports.File({ level: 'info', filename: './log/production.log' })
    ]
});

// Start server
const server = app.listen(parseInt(process.env.PORT), () => {
    console.log('listening on port %s...', server.address().port);
});