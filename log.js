const winston = require('winston');
const { format } = require('winston');
const { combine, timestamp, prettyPrint, printf } = format;

const logTimezone = () => {
    return new Date().toLocaleString('sv-SE', { timeZone: 'UTC' });
}

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        timestamp({format:logTimezone}),
        printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
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

module.exports = logger;