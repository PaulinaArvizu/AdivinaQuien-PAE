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
    .get('/users', async(req,res)=>{
        let u = await user.getUsers();
        res.status(200).send(u);
    })
    .get('/users/:email', async(req,res)=>{
        let u = await user.getUserByEmail(req.params.email)
        res.status(200).send(u);
    })
    .put('/users/:email', async(req,res)=> {
        let u = await user.putUser(req.params.email, req.params.body)
        if(u){
            res.status(200).send(u);
        }else{
            res.status(400).send("Usuario no existe");
        }
    })

module.exports = router;