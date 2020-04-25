let socket = io();

const onEvents = {
    // errores: "errores", //si ocurre algun error, 
    recibePregunta: "pregunta", //obtener mensajes del chat
    recibeRespuesta: "respuesta"
}

const emitEvents = { //envia mensajes del chat
    hacerPregunta: "pregunta",
    enviarRespuesta: "respuesta"
}

const chatStatus = {
    myQuestion: 0,
    awaitResponse: 1,
    awaitQuestion: 2,
    myResponse: 3
}

const gameStatus = {
    terminada: true,
    pendiente: false
}

let userEmail = "asdfg";
let jugador = {
    correo: "",
    password: "",
    nombre: "",
    fotoPerfil: "",
    historialPartidas: "",
    albumes: [],
    fotos: []
};

let game = {
    id: 0,
    jugador1: {
        correo: "asdfg",
        password: "1234",
        nombre: "hector",
        fotoPerfil: "",
        historialPartidas: "",
        albumes: [],
        fotos: []
    },
    jugador2: {
        correo: "qwerty",
        password: "1234",
        nombre: "paulina",
        fotoPerfil: "",
        historialPartidas: "",
        albumes: [],
        fotos: []
    },
    ganador: null,
    status: gameStatus.pendiente
};
let myChatStatus;

//botones de respuesta (pendiente por inicializar)
let btnYes;
let btnNo;

let btnSendChat; //boton de envio de pregunta

document.onload = () => { //pendiente: rutas
    userEmail = window.location.pathname;
    gameId = window.location.pathname;

    //get a la base de datos para acceder al juego
    //aqui se pone el get
    //determinar cual jugador esta jugando en esta ventana (el jugador 2 siempre empieza)
    if (userEmail == gameId.jugador1.id) {
        myChatStatus = chatStatus.awaitQuestion;
    } else {
        myChatStatus = chatStatus.myQuestion;
    }

}

btnYes.onclick = enviarRespuesta;
btnNo.onclick = enviarRespuesta;

function enviarRespuesta(event) {
    let seleccionado = event.target;
    let respuesta = seleccionado.attributes.name.nodeValue;
    seleccionado.classList.remove("btn-outline-primary");
    seleccionado.classList.add("btn-primary");

    //deshabilita los botones
    seleccionado.parentElement.children[1].setAttribute("disabled", true);
    seleccionado.parentElement.children[2].setAttribute("disabled", true);

    //envia la respuesta al otro jugador en el juego
    socket.to('game' + game.id).emit(emitEvents.enviarRespuesta, respuesta);
}




socket.on("errores", (msg) => {
    console.log("evento error", msg);
})

socket.on("updateAll", (msg) => {
    //muestra los usuarios y temas
    let usersHtml = msg.users.map(user =>
        `<div class="user row my-2">
                        <p class="ml-2"> ${user.name}</p>
                        <a class="mx-2" href="#"> <i class="fas fa-comments    "></i> </a>
                    </div>`);
    listaUsuarios.innerHTML = usersHtml.join('');

    let temasHtml = msg.temas.map(tema =>
        `<div class="temas row my-2">
                        <p class="ml-2"> ${tema.titulo}</p>
                        <a class="mx-2" href="#"> <i class="fas fa-sign-in-alt" onclick="entrarATema('${tema.titulo}')"></i> </a>
                        <a class="mx-2" href="#"> <i class="fas fa-sign-out-alt onclick="salirDeTema('${tema.titulo}')"></i> </a>
                    </div>`);
    listaTemas.innerHTML = temasHtml.join('');

})

socket.on('chatear', (msg) => {
    let clase = msg.usuario != 'servidor' ? 'user' : 'servidor';
    mensajesChat.innerHTML += `<p class="${clase}"><b>${msg.usuario}: </b>${msg.mensaje}</p>`;
})

socket.on('salirTema', tema => {
    salirDeTema(tema);
})

function entrarATema(tema) {
    console.log('Entrar a tema ' + tema);
    //envia mensaje de que entró
    socket.emit('registrar', {
        myCode,
        tema
    });
}

function salirDeTema(tema) {
    console.log('Salir de tema ' + tema);
    //envia mensaje de que salió
    socket.emit('salirTema', {
        myCode,
        tema
    });

}

function enviarMensaje() {
    let mensaje = valMessage.value;
    let clase = 'user';
    socket.emit('chatear', {
        myCode,
        mensaje
    });
}

btnEnviar.onclick = enviarMensaje;