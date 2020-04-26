let socket = io();

const onEvents = {
    recibeDatosJuego: "recibeDatosJuego",
    recibePregunta: "pregunta", //obtener mensajes del chat
    recibeRespuesta: "respuesta",
    recibeGuess: "guess",
    juegoTerminado: "juegoTerminado"
}

const emitEvents = { //envia mensajes al chat
    entrarAlJuego: "entarAlJuego",
    hacerPregunta: "pregunta",
    enviarRespuesta: "respuesta",
    enviarGuess: "guess",
    juegoTerminado: "juegoTerminado"
}

const gameStatus = {
    terminada: true,
    pendiente: false
}

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

//variables temporales para conocer el id del juego y el id del jugador
let gameId = localStorage.gameId;
let userEmail = "asdfg";
let myImg = '';
let selectedImg = getElementById("selectedImg");
let guessVeredict = false;

let myTurn;
let listaMensajes = getElementById("chat"); //ventana del chat donde aparecen las preguntas

//botones de respuesta
let btnYes = document.querySelectorAll(`[name="yes"]`);
btnYes = btnYes[btnYes.length-1]; //toma el ultimo boton

let btnNo = document.querySelectorAll(`[name="no"]`);
btnNo = btnNo[btnNo.length-1]; //toma el ultimo boton

let sendChat = document.getElementById('message'); //textarea de envio de pregunta

//botones para adivinar imagen
let guess = getElementById("guess");

btnYes.onclick = enviarRespuesta;
btnNo.onclick = enviarRespuesta;
sendChat.onkeypress = enviarPregunta;
guess.onclick = enviarGuess;

document.onload = () => { //pendiente: rutas
    socket.emit(emitEvents.entrarAlJuego, gameId);
}

socket.on(onEvents.recibeDatosJuego, gameData => {
    //guardar los datos del juego en variable local
    game = gameData;

    //determinar cual jugador esta jugando en esta ventana (el jugador 2 siempre empieza)
    if (userEmail == gameId.jugador1.correo) {
        myTurn = false;
    } else {
        myTurn = true;
    }
});

function enviarPregunta(event) {
    //solo se envia cuando se presiona "Enter" y es mi turno de preguntar
    if (event.keyCode != 13 || !myTurn) return;

    let mensaje = sendChat.value;

    let mensajeDiv = `
    <div class="direct-chat-msg">
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-left">${jugador.nombre}</span>
        </div>
    <!-- /.direct-chat-info -->
    <img alt="message user image"
        src="https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-6.png"
        class="direct-chat-img"><!-- /.direct-chat-img -->
        <div class="direct-chat-text">
            ${mensaje} <br>
            <button type="button" class="btn btn-outline-primary">Si</button>
            <button type="button" class="btn btn-outline-danger">No</button>
        </div>
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-img-reply-small pull-left"></span>
        </div>
        <!-- /.direct-chat-text -->
    </div>`;

    //agregar pregunta al chat
    listaMensajes.innerHTML = mensajeDiv.join('');

    //actualizar botones de respuesta
    btnYes = document.querySelectorAll(`[name="yes"]`);
    btnYes = btnYes[btnYes.length-1];
    
    btnNo = document.querySelectorAll(`[name="no"]`);
    btnNo = btnNo[btnNo.length-1];

    //actualiza el estatus del jugador (cuando envio una pregunta, tengo que esperar
    //la respuesta y no puedo hacer mas preguntas hasta contestar la que me envíe el
    //otro jugador)
    myTurn = false;

    //envia la pregunta
    socket.emit(emitEvents.hacerPregunta, {gameId: game.id, mensajeDiv});
}

socket.on(onEvents.recibePregunta, msg => {
    //agregar pregunta al chat
    listaMensajes.innerHTML = mensajeDiv.join('');

    //actualizar botones de respuesta
    btnYes = document.querySelectorAll(`[name="yes"]`);
    btnYes = btnYes[btnYes.length-1];
    
    btnNo = document.querySelectorAll(`[name="no"]`);
    btnNo = btnNo[btnNo.length-1];

});

function enviarRespuesta(event) {
    let seleccionado = event.target;
    let respuesta = seleccionado.attributes.name.nodeValue;
    
    if(respuesta == "yes") { //se seleccionó "si"
        seleccionado.classList.remove("btn-outline-primary");
        seleccionado.classList.add("btn-primary");
    } else { //se seleccionó "no"
        seleccionado.classList.remove("btn-outline-danger");
        seleccionado.classList.add("btn-danger");
    }

    //deshabilita los botones
    seleccionado.parentElement.children[1].setAttribute("disabled", true);
    seleccionado.parentElement.children[2].setAttribute("disabled", true);

    //actualiza estatus del jugador (al enviar la respuesta, ya es mi turno de preguntar)
    myTurn = true;

    //envia la respuesta al otro jugador en el juego
    socket.emit(emitEvents.enviarRespuesta, {gameId: game.id, respuesta});
}

socket.on(onEvents.recibeRespuesta, msg => {
    //boton de la respuesta seleccionada cambia de color
    let seleccionado = document.querySelectorAll(`[name="${msg}"]`);
    seleccionado = seleccionado[btnYes.length-1];
    
    if(msg == "yes") { //se seleccionó "si"
        seleccionado.classList.remove("btn-outline-primary");
        seleccionado.classList.add("btn-primary");
    } else { //se seleccionó "no"
        seleccionado.classList.remove("btn-outline-danger");
        seleccionado.classList.add("btn-danger");
    }

    //deshabilita los botones
    seleccionado.parentElement.children[1].setAttribute("disabled", true);
    seleccionado.parentElement.children[2].setAttribute("disabled", true);
});

function enviarGuess() {
    // let respuesta = seleccionado.attributes.name.nodeValue;
    let img = selectedImg.attributes.src.nodeValue;
    
    socket.emit(emitEvents.enviarGuess, {gameId: game.id, img});
}

socket.on(onEvents.recibeGuess, img => {
    let veredict = myImg == img;
    if(veredict) { //si el otro jugador adivinó, entonces esta persona pierde
        socket.emit(emitEvents.juegoTerminado, {gameId: game.id});
    } else {
        
    }
})

function finDelJuego(veredicto) {

}