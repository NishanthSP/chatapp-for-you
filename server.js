const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

let users = {
    'arnav' : 'agag123'
}

let socketMap = {}

io.on('connection', (socket) => {
    console.log('connected with socket id =', socket.id)

    function login(s, u)
    {
        s.join(u)
        s.emit('logged_in')
        socketMap[s.id] = u
        console.log(socketMap)
    }

    socket.on('login', (data) => {

        if(users[data.username])
        { if(users[data.username] == data.password)
            {
                login(socket, data.username)
            }
            else
            {
                socket.emit('login_failed')
            }

        }
        else
        {
            users[data.username] = data.password
            login(socket, data.username)
        }
        console.log(users)
    })


    socket.on('msg_send', (data) => 
    {
        data.from = socketMap[socket.id]
        if (data.to) 
        {
            io.to(data.to).emit('msg_rcvd', data)
        }
        else
        {
            socket.broadcast.emit('msg_rcvd', data)
        }
        // io.emit('msg_rcvd', data)
        
    })




})




app.use('/', express.static(__dirname + '/public'))

// io.on('connection', (socket) => 
// {
//     console.log("New socket formed from " + socket.id)
//     socket.emit('connected')

//     socket.on('login', (data) => {
//         // username is in data.user
//         usersockets[data.user] = socket.id
//         console.log(usersockets)
//     })
    
//     socket.on('send_msg', (data) => {
//         // if we use io.emit, everyone gets it
//         // if we use socket.broadcast.emit, only others get it
//         if (data.message.startsWith('@')) {
//             //data.message = "@a: hello"
//             // split at :, then remove @ from beginning
//             let recipient = data.message.split(':')[0].substr(1)
//             let rcptSocket = usersockets[recipient]
//             io.to(rcptSocket).emit('recv_msg', data)
//         } else {
//             io.emit('recv_msg', data)            
//         }
//     })

// })

server.listen(2345, () => 
{
    console.log('Website open on http://localhost:2345')
})