require('dotenv').config();

const testRoutes = require('./test');

const appRouter = function (app, fs) {
    // Add some applause on index route
    app.get('/', function (req, res) {
        res.send('<h1>Hello World</h1>');
    });

    if (Boolean(process.env.DEBUG)) {
        // Add routes for test API
        console.log('Adding test routes');
        testRoutes(app, fs);
    }

};

// Export the router
module.exports = appRouter;