const io = require('socket.io-client')

class Client {
    constructor(io) {
        this.io = io;
        
        io.on('reconnect', () => {
            this.login(io.name);
        })

        io.on('send', msg => {
            console.log(msg)
        })
    }

    login(name, callback) {
        this.name = name;
        this.io.emit('login', name, callback);
    }

    send(name, msg, callback) {
        this.io.emit('send', name, msg)
    }
}

function connect() {
    const socket = io.connect("http://localhost:80")
    return new Client(socket)
}

module.exports = {
    connect
}