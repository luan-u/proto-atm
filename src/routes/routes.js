// load up our shiny new route for users
const userRoutes = require('./user-routes');
const accountRoutes = require('./account-routes')

const appRouter = (app) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (req, res) => {
        res.send('Welcome to the development api-server');
    });

    // run our user route module here to complete the wire up
    userRoutes(app);
    accountRoutes(app);
};

module.exports = appRouter;