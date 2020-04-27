const router = require('express').Router();
const passportLocal = require('./passportLocal')

router.post('/login', passportLocal.login)


module.exports = router;