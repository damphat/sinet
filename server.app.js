var app = require('socket.io')

class Server {
    users = {}

    constructor(io) {
        io.on('connect', sock => {

            sock.on('login', (name, cb) => {
                if(sock.name == null) return cb('already login')
                sock.name = name;
                var user = this.users[name] = this.users[name] || {
                    sockets: {}
                }
                user.sockets[sock.id] = sock;
                return cb();
            })

            sock.on('send', (name, msg, cb) => {
                var user = users[name];
                if(!user) return cb('user not found')

                for(var s of Object.values(user.sockets)) {
                    s.emit('send', sock.name, msg)
                }

                return cb()
            })

            sock.on('disconnect', () => {
                if(sock.name != null) {
                    delete users[name].sockets[sock.id]
                }
            })
        })
    }


}

function start(port, cb) {
    var io = require('socket.io')();

    var srv = require('http').createServer((req, res) => res.end('ok'));
    srv.listen(port, cb)
    srv.on('error', (err) => cb(err))
    return new Server(io);
}

require('./repl')({
    start
})