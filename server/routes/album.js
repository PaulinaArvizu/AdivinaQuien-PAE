const router = require('express').Router();
const album = require('../models/album')
const user = require('../models/usuario')
router.get('/albums', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            let u = await user.getUserByEmail(req.user.email);
            let a = [];
            u.albumes.forEach(element => {
                a.push(element);
            });
            return a;
        }
    })
    .post('/albums', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            let newAlbum = req.body;
            if (!newAlbum.nombre || !newAlbum.fotos) {
                res.status(400).send('Faltan atributos del album')
            } else {
                user.addAlbum(req.user.email, newAlbum)
                let a = album.createAlbum(newAlbum.nombre, newAlbum.fotos)
                res.status(201).send(a)
            }
        }
    })
    .get('/albums/:id', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            let a = await album.getAlbumById(req.body.uid)
            res.status(200).send(a)
        }
    })
    .put('/albums/:id', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            let changeAlbum = req.body;
            if (!changeAlbum.nombre || !changeAlbum.fotos) {
                res.status(400).send('Faltan atributos del album')
            } else {
                album.putAlbum(req.params.id, changeAlbum)
            }
        }
    })
    .delete('/albums/:id', async (req, res) => {
        if (req.user == undefined) {
            res.status(400).send('Sesion no iniciada');
        } else {
            
        }
    })
module.exports = router;