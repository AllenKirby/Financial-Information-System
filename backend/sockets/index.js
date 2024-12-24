const {Server} = require('socket.io')
const socketAuth = require('../middleware/socketAuth')

const editorSocket = require('./editorSocket');

const initializeSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    io.use(socketAuth);

    console.log('Socket.IO initialized');

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // userSocket(socket, io);
        // adminSocket(socket, io);
        editorSocket(socket, io)
        // operatorSocket(socket, io);
        // headSocket(socket, io);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initializeSockets;