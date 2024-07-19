const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('location', (data) => {
        console.log('Location received:', data);
        io.emit('location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        io.emit('user disconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
