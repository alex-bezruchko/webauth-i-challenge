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

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    db('users').where({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


module.exports = server;