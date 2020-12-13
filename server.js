const server = require('socket.io')(80);
const log = console.log;
const users = {}

server.on('connect', s => {
    log('connect', s.id)

    s.on('login', name => {
        log('login', s.id, name)
        if(s.name) return;

        users[name] = users[name] || {
            sockets: {}
        }

        users[name].sockets[s.id] = s
    })

    s.on('send', ( name, msg) => {
        var des = users[name];
        if(!des) return log(`users['${name}'] is not found`)
        for(var sock of Object.values(des.sockets)) {
            sock.emit('send', {
                from: s.name,
                msg
            })
        }
    })

    s.on('disconnect', () => {
        log('disconnect', s.id)
        if(s.name) {
            delete users[s.name].sockets[s.id];
        }
    })
})