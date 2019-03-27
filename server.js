const express = require('express');
const server = express();
const knex = require('knex');
var bcrypt = require('bcryptjs');
server.use(express.json());

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

server.get('/', (req, res) => {
    res.status(200).json('Home Page up and running')
});

server.post('/api/register', (req, res) => {
    const userInfo = req.body;
    const hash = bcrypt.hashSync(userInfo.password, 12);
    userInfo.password = hash;
    db('users')
    .insert(userInfo)
    .then(ids => {
        res.status(201).json(ids)
    })
    .catch(err => res.json(err))
})


module.exports = server;