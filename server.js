const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', socket => {
    socket.on('new-user', username => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
        io.emit('users-count', Object.keys(users).length);
    });

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message);
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        socket.broadcast.emit('user-disconnected', username);
        io.emit('users-count', Object.keys(users).length);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
   
