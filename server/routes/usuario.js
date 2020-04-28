const router = require('express').Router();
const User = require('../models/usuario')
router.post('/users', async (req, res) => {
        if (!req.body.email || !req.body.password || !req.body.nombre) {
            res.status(400).send('Faltan datos.');
            return;
        }
        let newUser = await User.createUser(req.body.email, req.body.password, req.body.nombre);
        if (newUser != undefined) {
            res.status(201).send(newUser);
        } else {
            res.status(500).send('Error al crear el usuario.');
        }
    })
    .get('/users', async (req, res) => {
        let u = await User.getUsers();
        res.status(200).send(u);
    })
    .get('/users/:email', async (req, res) => {
        let u = await User.getUserByEmail(req.params.email)
        res.status(200).send(u);
    })
    .put('/users/:email', async (req, res) => {
        let u = await User.putUser(req.params.email, req.body)
        if (u) {
            res.status(200).send(u);
        } else {
            res.status(400).send("Usuario no existe");
        }
    })

module.exports = router;