require('dotenv').config();

const testRoutes = require('./test');
const dataApiRoutes = require('./jsonapi');
const logger = require('../log')

const appRouter = function (app, fs) {
    // Add some applause on index route
    app.get('/', function (req, res) {
        res.send('<h1>Hello World</h1>');
    });

    if (Boolean(process.env.DEBUG)) {
        // Add routes for test API
        logger.debug('Adding test routes');
        testRoutes(app, fs);
    }

    // Main API routes
    dataApiRoutes(app, fs);

};

// Export the router
module.exports = appRouter;