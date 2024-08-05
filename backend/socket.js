const { Server } = require('socket.io');
const { handleSocketEvents } = require('./controllers/tradeController'); // Import the function

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            transports: ['websocket', 'polling']
        },
    });

    io.on('connection', handleSocketEvents); // Use the controller function to handle events
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };
