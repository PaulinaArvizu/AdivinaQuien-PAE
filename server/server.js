const express = require('express');
const cors = require('cors');
const users = require('./users.json');
const fs = require('fs');
const authRouter = require('./routes/auth')
const http = require('http').Server(app);
const io = require('socket.io')(http);

// io.on('connection', (socket) => {
//     const chat = require('./routes/chat')(socket, io);
// })

const app = express();
const port = 3000;

//middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + '/public'));

//rutas
// app.use(uploadRouter);
app.use(authRouter);

// app.get('/', (req, res) => {
//     res.send("server");
// })
app.get('/api/users', (res, req) => {
        console.log('query params', req.body);
        req.json(users);
    })
    .post('/api/users', (req, res) => {
        console.log(req.body);

        let {
            nombre,
            pw,
            estado,
            hobbies
        } = req.body;
        if (nombre && pw && estado && hobbies != undefined) {
            if (users.some(u => u.nombre == nombre)) {
                res.status(401).send({
                    error: 'usuario ya existe'
                });
            } else {
                let newUser = {
                    nombre,
                    pw,
                    estado,
                    hobbies
                };
                users.push(newUser);
                fs.writeFileSync('users.json', JSON.stringify(users));
            }
        } else {
            res.status(400).send({
                error: 'faltan datos'
            });
        }
    })
    .get('*', (req, res) => { //se fuerza la redireccion de cualquier ruta al index que está en public
        res.sendFile(__dirname + '/public/index.html');
    })


io.on('connection', function (socket) { //cuando se abre una pestaña, hace lo siguiente
    console.log('Un usuario ha entrado al juego');

    socket.on(onEvents.entrarAlJuego, gameId => {
        let foundGame = games.find(g => g.id == gameId);

        //mete al jugador al room
        socket.join('game' + gameId);

        //envia al jugador los datos del juego
        socket.emit(emitEvents.recibeDatosJuego, foundGame);
    })
    socket.on(onEvents.hacerPregunta, msg => { //msg = {gameId, mensajeDiv}
        // sending to all clients in 'game' room except sender
        socket.to('game' + msg.gameId).emit(emitEvents.recibePregunta, msg.mensajeDiv);
    })
    socket.on(onEvents.enviarRespuesta, msg => { //msg = {gameId, respuesta}
        // sending to all clients in 'game' room except sender
        socket.to('game' + msg.gameId).emit(emitEvents.recibeRespuesta, msg.respuesta);
    })
    socket.on(onEvents.enviarGuess, msg => { //msg = {gameId, img}
        socket.to('game' + msg.gameId).emit(emitEvents.recibeGuess, msg.img);
    })


});

const emitEvents = { //eventos que el usuario obtiene
    recibeDatosJuego: "recibeDatosJuego",
    recibePregunta: "pregunta",
    recibeRespuesta: "respuesta",
    recibeGuess: "guess",
    juegoTerminado: "juegoTerminado"
}

const onEvents = { //eventos que el usuario envia
    entrarAlJuego: "entarAlJuego",
    hacerPregunta: "pregunta",
    enviarRespuesta: "respuesta",
    enviarGuess: "guess",
    juegoTerminado: "juegoTerminado"
}

app.listen(port, () => console.log("running on port " + port));