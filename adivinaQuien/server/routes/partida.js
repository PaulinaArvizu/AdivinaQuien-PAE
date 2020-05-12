const router = require('express').Router();
const Partida = require('../models/partida');
router.get('/partidas', async (req, res) => {
        let a = await Partida.getPartidas();
        res.status(200).send(a);
    })
    .post('/partidas', async (req, res) => {
        let newGame = req.body;
        if (!newGame.jugador1 || !newGame.jugador2 || !newGame.album) {
            res.status(400).send('Faltan atributos de la partida.');
        } else {
            let a = await Partida.createPartida(newGame.jugador1, newGame.jugador2, newGame.album);
            console.log(a)
            res.status(201).send(a);
        }
    })
    .get('/partidas/:id', async (req, res) => {
        let a = await Partida.getPartidaById(req.params.id);
        res.status(200).send(a);
    })
    .put('/partidas/:id', async (req, res) => {
        let newGame = req.body;
        // if (!newGame.Jugador1 || !newGame.Jugador2 || !newGame.album) {
        //     res.status(400).send('Faltan atributos de la partida.');
        // } else {
            let a = await Partida.putPartida(req.params.id, newGame);
            res.status(200).send(a);
        // }

    })
    .delete('/partidas/:id', async (req, res) => {
        let a = await Partida.deletePartida({'_id':req.params.id});
        res.status(200).send(a);
    })

module.exports = router;