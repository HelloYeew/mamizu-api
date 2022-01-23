const testRoutes = require('./test');

const appRouter = function (app, fs) {
    // Add some applause on index route
    app.get('/', function (req, res) {
        res.send('<h1>Hello World</h1>');
    });

    // Add routes for API
    testRoutes(app, fs);
};

// Export the router
module.exports = appRouter;