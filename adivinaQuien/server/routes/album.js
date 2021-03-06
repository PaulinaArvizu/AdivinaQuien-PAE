const router = require('express').Router();
const Album = require('../models/album');
router.get('/albums', async (req, res) => {
        let a = await Album.getAlbums();
        res.status(200).send(a);
    })
    .post('/albums', async (req, res) => {
        let newAlbum = req.body;
        if (!newAlbum.nombre || !newAlbum.fotos) {
            res.status(400).send('Faltan atributos del album.');
        } else {
            let a = await Album.createAlbum(newAlbum.nombre, newAlbum.fotos);
            if(a) {
                res.status(201).send(a);
            } else {
                res.status(500).send("Error al crear.");
            }
        }
    })
    .get('/albums/:id', async (req, res) => {
        let a = await Album.getAlbumById(req.params.id);
        res.status(200).send(a);
    })
    .put('/albums/:id', async (req, res) => {
        let newAlbum = req.body;
        if (!newAlbum.nombre || !newAlbum.fotos) {
            res.status(400).send('Faltan atributos del album.');
        } else {
            let a = await Album.putAlbum(req.params.id, newAlbum);
            res.status(200).send(a);
        }

    })
    .delete('/albums/:id', async (req, res) => {
        let a = await Album.deleteAlbum({'_id': req.params.id});
        res.status(200).send(a);
    })

module.exports = router;