type CB<T = unknown> =  (err: Error | null, result: T) => void;

class Client {
    sock: SocketIOClient.Socket
    
    constructor(sock: SocketIOClient.Socket) {
        this.sock = sock
        sock.on('connect', console.log)
        sock.on('send', (name: string, msg: unknown) => {
            console.log(name, msg);
        })
        sock.on('disconnect', console.log)
    }

    login(name: string, cb: CB<string>) {
        if(cb) { 
            this.sock.emit('login', name, cb)
        } else {
            return new Promise((resolve, reject) => {
                this.sock.emit('login', name, (err: unknown) => {
                    return err ? reject(err) : resolve(undefined)
                })
            });
        }
    }

    send(name: string, msg: unknown, cb: CB) {
        if(cb) {
            this.sock.emit('send', name, msg, cb)
            return
        }

        return new Promise((resolve, reject) => {
            this.sock.emit('send', name, msg, (err) => {
                return err ? reject(err) : resolve(undefined)
            })
        })
    }
    
    close() {
        this.sock.close();
    }
}

import io = require('socket.io-client')
function connect(port: number) {
    const sock = io("http://localhost:" + port)
    sock.connect()
    return new Client(sock);
}

function log(...args: unknown[]) {
    console.log.apply(null, ['----', ...args])
}

import replex from './replex'
replex({
    a: connect(80),
    connect,
    log
})