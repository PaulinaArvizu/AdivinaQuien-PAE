const express = require('express');
const cors = require('cors');
const users = require('./users.json');
const fs = require('fs');
const authRouter = require('./routes/auth')
const albumRouter = require('./routes/album')
const fotoRouter = require('./routes/fotos')
const userRouter = require('./routes/usuario')
const partidaRouter = require('./routes/partida')

const app = express();
// const port = 3000;
var path = require('path');

const http = require('http').Server(app);
const io = require('socket.io')(http);

// io.on('connection', (socket) => {
//     const chat = require('./routes/chat')(socket, io);
// })

//middlewares
app.use(cors());
app.use(express.json());


// console.log(path.join(__dirname, '..', 'dist', 'adivinaQuien'));
// app.use(express.static(path.join(__dirname, '..', 'dist', 'adivinaQuien')));
app.use(express.static(__dirname + '/public'));

//rutas
// app.use(uploadRouter);
app.use('/api/', authRouter);
app.use('/api/', partidaRouter);
app.use('/api/', albumRouter);
app.use('/api/', fotoRouter);
app.use('/api/', userRouter);
// app.get('/', (req, res) => {
//     res.send("server");
// })
// app.get('/api/users', (res, req) => {
//         console.log('query params', req.body);
//         req.json(users);
//     })
//     .post('/api/users', (req, res) => {
//         console.log(req.body);

//         let {
//             nombre,
//             pw,
//             estado,
//             hobbies
//         } = req.body;
//         if (nombre && pw && estado && hobbies != undefined) {
//             if (users.some(u => u.nombre == nombre)) {
//                 res.status(401).send({
//                     error: 'usuario ya existe'
//                 });
//             } else {
//                 let newUser = {
//                     nombre,
//                     pw,
//                     estado,
//                     hobbies
//                 };
//                 users.push(newUser);
//                 fs.writeFileSync('users.json', JSON.stringify(users));
//             }
//         } else {
//             res.status(400).send({
//                 error: 'faltan datos'
//             });
//         }
//     })
//     .get('*', (req, res) => { //se fuerza la redireccion de cualquier ruta al index que está en public
//         res.sendFile(__dirname + '/public/index.html');
//     })

const usersModel = require('./models/usuario')
const gameModel = require('./models/partida')
io.on('connection', function (socket) { //cuando se abre una pestaña, hace lo siguiente
  console.log('Un usuario ha entrado al juego');

  socket.on(onEvents.entrarAlJuego, gameId => {
    gameModel.getPartidaById(gameId).then((foundGame) => {
    //   console.log(foundGame);
      //mete al jugador al room
      console.log('mete al jugador al room game' + gameId);
      socket.join('game' + gameId);

      //envia al jugador los datos del juego
      socket.emit(emitEvents.recibeDatosJuego, foundGame);
      
    })

  })
  socket.on(onEvents.hacerPregunta, msg => { //msg = {gameId, mensaje}
    // sending to all clients in 'game' room except sender
    socket.to('game' + msg.gameId).emit(emitEvents.recibePregunta, msg.mensaje);
  })
  socket.on(onEvents.enviarRespuesta, msg => { //msg = {gameId, respuesta}
    // sending to all clients in 'game' room except sender

    socket.to('game' + msg.gameId).emit(emitEvents.recibeRespuesta, msg.respuesta);
  })
  socket.on(onEvents.enviarGuess, msg => { //msg = {gameId, img}
    console.log(msg)
    socket.to('game' + msg.gameId).emit(emitEvents.recibeGuess, msg.img);
  })
  socket.on(onEvents.enviarVeredicto, async msg => { //msg = {gameId, userEmail, win}
    //get al usuario con "userEmail"
    console.log('se hace un get al usuario con su correo');
    let u = await usersModel.getUserByEmail(msg.userEmail)
    if (msg.win) { //esta persona ganó
      //get al juego con "gameId"
      console.log('get al juego con "gameId"');
      let g = gameModel.getPartidaById(msg.gameId)
      //update al juego de quien ganó y cambiar el status a "terminado"
      console.log('update al juego de quien ganó y cambiar el status a "terminado"');
      await gameModel.putPartida(g._id, {
        ganador: u.email,
        status: true
      })
      
      //se le notifica al otro usuario que perdió
      socket.emit(emitEvents.juegoPerdidio);
      socket.to('game'+msg.gameId).emit(emitEvents.juegoGanado);
    } else { //esta persona perdió
      //se le notifica al otro usuario que ganó
      await gameModel.putPartida(msg.gameId, {
        ganador: u.email,
        status: true
      })
      socket.to('game'+msg.gameId).emit(emitEvents.juegoPerdidio);
      socket.emit(emitEvents.juegoGanado);
      
    }
  })
  socket.on(onEvents.juegoGanado, async msg => { //msg = {gameId, userEmail}
    //get al usuario con "userEmail"
    console.log('se hace un get al usuario con su correo');
    let u = await usersModel.getUserByEmail

    //get al juego con "gameId"
    console.log('get al juego con "gameId"');
    let g = await gameModel.getPartidaById(msg.gameId)
    //update al juego de quien ganó y cambiar el status a "terminado"
    console.log('update al juego de quien ganó y cambiar el status a "terminado"');
    await gameModel.putPartida(g.gameId, {
      ganador: u.email,
      status: true
    })

  })
  socket.on(onEvents.juegoPerdidio, async msg => { //msg = {gameId, userEmail}
    //get al usuario con "userEmail"
    console.log('se hace un get al usuario con su correo');
    let u = await usersModel.getUserByEmail(msg.userEmail)
    //update al usuario de su historial de juegos con el veredicto (win)
    console.log("update al usuario de su historial de juegos con el veredicto (win)");
    u.historialPartidas.push(msg.gameId)
    await usersModel.putUser(u.email, {historialPartidas:u.historialPartidas})
  })

});

const emitEvents = { //eventos que el usuario obtiene
  recibeDatosJuego: "recibeDatosJuego",
  recibePregunta: "pregunta",
  recibeRespuesta: "respuesta",
  recibeGuess: "guess",
  recibeVeredicto: "veredicto",
  juegoPerdidio: "perder",
  juegoGanado: "ganar"
}

const onEvents = { //eventos que el usuario envia
  entrarAlJuego: "entrarAlJuego",
  hacerPregunta: "pregunta",
  enviarRespuesta: "respuesta",
  enviarGuess: "guess",
  enviarVeredicto: "veredicto",
  juegoPerdidio: "perder",
  juegoGanado: "ganar"
}

app.get('*', (req,res)=> {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// app.listen(port, () => console.log("running on port " + port));
module.exports = http;
// http.listen(port)
