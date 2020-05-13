const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const Users = require('../models/usuario');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function(username, password, done) {
    let usr = await Users.getUserByEmail(username);
    console.log(username, password);
    console.log(await usr);
    if (usr.password == password) {
        done(null, usr);
    } else {
        done(null, false, {
            error: "Datos incorrectos"
        });
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
