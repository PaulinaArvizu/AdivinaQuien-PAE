const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleConfig = require('../googleConfig');
const users = require('../users.json');
const fs = require('fs');
const jwt = require('jsonwebtoken');


passport.use(new GoogleStrategy({
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret,
    callbackURL: googleConfig.callbackURL //Se necesita poner herokuapp una vez implementado. Por el momento sera localhost:3000/google/redirect
}, function(accessToken, refreshToken, profile, done){
    console.log(profile);
    if(profile == null){
        done(null, false, {error: "No fue posible autenticarse"})
        return;
    }

    let newUser= {
        email: profile._json.email,
        info: profile._json
    }

    let findUser = users.find(u => u.email == newUser.email); // GET User con email de la API

    if(findUser){//Sign in
        done(null, findUser);
        return;
    }      
    else
    {//Registro
        users.push(newUser);
        fs.writeFileSync('users.json', JSON.stringify(users)); //POST de la API
        done(null, newUser);
    }


}

))

function googleLogin(req, res){

    console.log("Entrando a googleLogin");
    passport.authenticate('google', (err, user, info) => {
        console.log("JohnnyTest");
        console.log(user);
        if (user) {
            let token = jwt.sign({
                nombre: user.email
            }, 'Secret', {
                expiresIn: '1h' 
            })
            res.send({
                token
            })
        } else {
            res.status(401).send(info)
        }
    })(req, res)

}

module.exports = {googleLogin};
