const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const fs = require('fs'); // file helper
const { format } = require('winston');
const { combine, timestamp, prettyPrint, printf } = format;

require('dotenv').config();

// Load up app and routes
const app = express();
const routes = require('./routes/routes.js')(app, fs);

// Using body parser as JSON parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const timezoned = () => {
    return new Date().toLocaleString('sv-SE', { timeZone: 'UTC' });
}

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        timestamp({format:timezoned}),
        printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}] : ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'debug',
            filename: './log/debug.log'
        }),
        new winston.transports.File({
            level: 'info',
            filename: './log/production.log'
        })
    ]
});

logger.info('Server started');

// Start server
const server = app.listen(parseInt(process.env.PORT), () => {
    console.log('listening on port %s...', server.address().port);
});