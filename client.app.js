class Client {

}

function connect(port) {
    var io = require('socket.io-client')("localhost:" + port)
    return new Client(io);
}

require('./repl')({

})