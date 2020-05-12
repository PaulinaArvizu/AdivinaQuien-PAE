const router = require('express').Router();
const passport = require('passport');
const passportLocal = require('./passportLocal');
const passportGoogle = require('./passportGoogle');


router.post('/login', passportLocal.login)

router.get('/google/login', passport.authenticate('google', {scope:['profile','email']})), 
router.get('/google/redirect', passportGoogle.googleLogin);

module.exports = router;
