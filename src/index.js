const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server) 
const port = process.env.PORT || 3001
const pathDirectory = path.join(__dirname,'../public')

app.use(express.static(pathDirectory))


io.on('connection',(socket)=>{
    console.log('New Web Socket Connection')

    

    socket.on('join',({username ,room},callback) => {
        
         const {error,user}= addUser({id : socket.id,username,room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUserInRoom(user.room)
        })
        callback()

    })
    
    // Sending Messages
    socket.on('submissions',(message, callback) => {
        const user= getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity Not allowed')
        }

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('location',(obj,callback) => {
        const user= getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${obj.latitude},${obj.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {

        const user= removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUserInRoom(user.room)
            })
        }

    })
})


server.listen(port,() => {
    console.log("Server Started")
})