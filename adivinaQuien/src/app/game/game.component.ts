import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../socket-io.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameStatus = {
    terminada: true,
    pendiente: false
  }
  msgChat: object[] = []
  msgSend = '';
  jugador = {
    correo: "",
    password: "",
    nombre: "",
    fotoPerfil: "",
    historialPartidas: "",
    albumes: [],
    fotos: []
};
  myImg: string;
  selectedImg: string;
  game = {
    id: 0,
    jugador1: {
      correo: "",
      password: "",
      nombre: "",
      fotoPerfil: "",
      historialPartidas: "",
      albumes: [],
      fotos: []
    },
    jugador2: {
      correo: "",
      password: "",
      nombre: "",
      fotoPerfil: "",
      historialPartidas: "",
      albumes: [],
      fotos: []
    },
    ganador: null,
    status: this.gameStatus.pendiente,
    album: []
  };
  guessVeredict: boolean = false;
  myTurn: boolean;
  contrincante = {
    correo: "",
    password: "",
    nombre: "",
    fotoPerfil: "",
    historialPartidas: "",
    albumes: [],
    fotos: []
  };
  constructor(private socketIOservice: SocketIoService) { }

  ngOnInit(): void {
    this.socketIOservice.recibirDatosJuego().subscribe((datos: object) => {
      this.game = datos;

      this.myTurn = this.jugador.correo == this.game.jugador2.correo;

    })
    this.socketIOservice.recibirGuess().subscribe((guess: string) => {
      console.log(guess)
    })
    this.socketIOservice.recibirPregunta().subscribe((pregunta: string) => {
      this.msgChat.push({
        nombre: this.contrincante.nombre,
        pregunta: pregunta
      })
    })
  }
  enviarMensaje(event) {
    if (event.keyCode != 13) return;
    this.socketIOservice.enviarPregunta(this.msgSend)
    // console.log(this.msgSend)
    this.msgSend = ''
  }

}
