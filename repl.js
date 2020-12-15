module.exports = function(ctx) {
    var app = require('repl').start()
    Object.assign(app.context, ctx)
    return app;
}