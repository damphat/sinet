import repl from './replex'
import * as IO from 'socket.io'
import http from 'http'

declare module "socket.io" {
    export interface Socket {
        name: string;
    }
}

class Server {
    users: {
        [name:string]: {
            sockets: {
                [id:string]: IO.Socket
            }
        }
    } = {}

    dumpUser(name: string) {
        const user = this.users[name]
        const ret = {};
        for(const id of Object.keys(user.sockets)) {
            ret[id] = true;
        }
        return ret;
    }

    dump() {
        const r = {}
        for(const name in this.users) {
            r[name] = this.dumpUser(name)
        }
        log(r)
    }

    constructor(io : IO.Server) {
        io.on('connect', sock => {
            log('connect', sock.id)

            sock.on('login', (name, cb) => {
                log('login', sock.id, name)
                if(sock.name != null) return cb('already login')
                sock.name = name;
                const user = this.users[name] = this.users[name] || {
                    sockets: {}
                }
                user.sockets[sock.id] = sock;
                this.dump()
                return cb();
            })

            sock.on('send', (name, msg, cb) => {
                log('send', sock.id, name, msg)
                const user = this.users[name];
                if(!user) return cb('user not found')

                for(const s of Object.values(user.sockets)) {
                    s.emit('send', sock.name, msg)
                }

                return cb()
            })

            sock.on('disconnect', () => {
                log('disconnect', sock.id)
                if(sock.name != null) {
                    delete this.users[sock.name].sockets[sock.id]
                }
                this.dump()
            })
        })
    }
}

function start(port, cb) {
    const io = IO.default();
    const app = new Server(io);

    const srv = http.createServer((req, res) => res.end('ok'));
    io.listen(srv)
    srv.listen(port, cb)
    srv.on('error', (err) => cb(err))

    return app;
}

function log(...args: unknown[]) {
    console.log.apply(null, ['----', ...args])
}

repl({
    1:1,
    start,
    s: start(80, log),
    log
})