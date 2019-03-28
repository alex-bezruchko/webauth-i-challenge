const express = require('express');
const server = express();
const knex = require('knex');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const sessionConfig = {
    name: 'CookieName',
    secret: 'CookieSecret',
    cookie: {
        maxAge: 1000 * 60 * 2,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,

}
server.use(express.json());
server.use(session(sessionConfig));
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);


server.get('/', restricted, (req, res) => {
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
        req.session.username = user.username;
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

server.get('/api/users', (req, res) => {
    // const hash = bcrypt.hashSync(password, 10)

    // username.password = hash;
    db('users')
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => res.json(err))
})
function restricted(req,res,next) {
    if (req.session && req.session.user) {
        next()
    }
    else {
        res.status(401).json({message: 'This page is restricted to unregistered users'})
    }
    
}
module.exports = server;