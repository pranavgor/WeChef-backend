/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/auth', require('./auth.js')(router));
    app.use('/recipes', require('./recipes.js')(router));
};
