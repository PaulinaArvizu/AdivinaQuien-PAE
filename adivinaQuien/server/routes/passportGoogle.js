const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleConfig = require('../googleConfig');
const User = require('../models/usuario');
const fs = require('fs');
const jwt = require('jsonwebtoken');


passport.use(new GoogleStrategy({
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret,
    callbackURL: googleConfig.callbackURL //Se necesita poner herokuapp una vez implementado. Por el momento sera localhost:3000/google/redirect
}, async function(accessToken, refreshToken, profile, done){
    if(profile == null){
        done(null, false, {error: "No fue posible autenticarse"})
        return;
    }
    let currUser = await User.getUserByEmail(profile._json.email);

    if(await currUser){//Sign in
        done(null, currUser);
        return;
    }      
    else
    {//Registro
        let newUser = await User.createUser(profile._json.email, random_password_generate(8, 16), profile._json.name);
        console.log(newUser.email);
        done(null, await newUser);
    }

}

))

function random_password_generate(max,min)
{
    var passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@!%&()/";
    var randPwLen = Math.floor(Math.random() * (max - min + 1)) + min;
    var randPassword = Array(randPwLen).fill(passwordChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return randPassword;
}

function googleLogin(req, res){

    console.log("Entrando a googleLogin");
    passport.authenticate('google', (err, user, info) => {
        console.log("JohnnyTest");
        console.log(user);
        if (user) {
            let token = jwt.sign({
                email: user.email,
                nombre: user.nombre
            }, 'secret', {
                expiresIn: '1h' 
            });
            console.log(token);
            res.send({
                token
            })
        } else {
            res.status(401).send(info)
        }
    })(req, res)

}

module.exports = {googleLogin};
