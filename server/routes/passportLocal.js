const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const Users = require('../models/usuario')


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) => {
    let usr = await Users.getUserByEmail(username);
    if (usr.password == password) {
        done(null, usr);
    } else {
        done(null, false, {
            error: "Datos incorrectos"
        });
    }
}))

function login(req, res) {
    passport.authenticate('local', (err, usr, info) => {
        if (usr) {
            let token = jwt.sign({
                nombre: usr.email
            }, 'Secret', {
                expiresIn: '14d' 
            })
            res.send({
                token
            })
        } else {
            res.status(401).send(info)
        }
    })(req, res);
}


module.exports = {
    login
};