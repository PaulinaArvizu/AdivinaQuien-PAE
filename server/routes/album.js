const router = require('express').Router();
const album = require('../models/album')
const user = require('../models/usuario')
router.get('/album', async (req, res) => {
    if (req.user == undefined) {
        res.status(400).send('Sesion no iniciada');
    } else {
        
    }
})
.post('/fotos', async (req, res) => {
    
})
module.exports = router;