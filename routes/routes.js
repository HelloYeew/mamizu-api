require('dotenv').config();
const dataApiRoutes = require('./jsonapi');

const appRouter = function (app, fs) {
    // Add some applause on index route
    app.get('/', function (req, res) {
        res.send('<h1>Hello World</h1>');
    });

    // Main API routes
    dataApiRoutes(app, fs);

};

// Export the router
module.exports = appRouter;