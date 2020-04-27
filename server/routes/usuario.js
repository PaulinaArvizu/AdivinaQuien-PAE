const router = require('express').Router();
const user = require('../models/usuario')
router.post('/users',async (req, res) => {
        let newUser = await user.createUser(req.body.email,req.body.password,req.body.nombre)
        if(newUser != undefined){
            res.status(201).send(a)
        }else{
            res.status(400).send('No se pudo agregar')
        }
    })
    .get('/users')
    .get('/users/:email')
    .put('/users/:email', async(req,res)=> {
        user.putUser(req.params.email, req.params.body)
    })

module.exports = router;