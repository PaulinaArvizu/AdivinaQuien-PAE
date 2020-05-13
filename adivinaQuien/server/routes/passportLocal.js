const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const Users = require('../models/usuario');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function(req, username, password, done) {
    let usr = await Users.getUserByEmail(username);
    console.log('user found: ')
    console.log(await usr);
    if(usr) {
        if (usr.password == password) {
            done(null, usr);
        } else {
            done(null, false, {
                error: "Datos incorrectos"
            });
        }
    } else {
        console.log('registrar');
        console.log(req.body.nombre);
        if(req.body.nombre){
            newUser = await Users.createUser(username, password, req.body.nombre);
            console.log(await newUser);
            done (null, newUser);
        } else {
            done(null, false, {
                error: "Datos incorrectos"
            });
        }
    }
}))


function login(req, res) {
    console.log('passport Login');
    console.log(req.body);
    passport.authenticate('local', (err, usr, info) => {
        if (usr) {
            console.log("LocalTest");
            console.log(usr);
            let token = jwt.sign({
                email:  usr.email,
                nombre: usr.nombre
            }, 'secret', {
                expiresIn: '1h' 
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
