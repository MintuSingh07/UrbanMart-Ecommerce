const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const AuthRoute = require('./routes/Auth.route');
const ProductRoute = require('./routes/Product.route');
const TradeRoute = require('./routes/Trade.route');
const { initializeSocket, getIO } = require('./socket');
const connectDB = require('./DB/db');

const app = express();
const PORT = process.env.PORT;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server with CORS options
initializeSocket(server);

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', AuthRoute);
app.use('/', ProductRoute);
app.use('/trades', TradeRoute);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
