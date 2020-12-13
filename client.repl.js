const server = require('repl').start();

const client = require('./client')
user = client.connect();
Object.assign(server.context, {
    user
})