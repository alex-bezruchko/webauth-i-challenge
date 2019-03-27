const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json('Home Page up and running')
});

server.use('/api/users/', userRoutes);


module.exports = server;