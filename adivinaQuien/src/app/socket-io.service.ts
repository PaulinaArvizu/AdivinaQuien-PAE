import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  constructor(private socket: Socket) {

  }

  onEvents = { //recibe mensajes
    recibeDatosJuego: "recibeDatosJuego",
    recibePregunta: "pregunta",
    recibeRespuesta: "respuesta",
    recibeGuess: "guess",
    recibeVeredicto: "veredicto",
    juegoPerdido: "perder",
    juegoGanado: "ganar"
  }

  emitEvents = { //envia mensajes al chat
    entrarAlJuego: "entrarAlJuego",
    hacerPregunta: "pregunta",
    enviarRespuesta: "respuesta",
    enviarGuess: "guess",
    enviarVeredicto: "veredicto",
    juegoPerdido: "perder",
    juegoGanado: "ganar"
  }
  entrarAlJuego(gameId) {
    this.socket.emit(this.emitEvents.entrarAlJuego, gameId)
  }
  enviarPregunta(pregunta) {
    this.socket.emit(this.emitEvents.hacerPregunta, pregunta)
  }
  enviarRespuesta(respuesta) {
    this.socket.emit(this.emitEvents.enviarRespuesta, respuesta)
  }
  enviarGuess(guess) {
    this.socket.emit(this.emitEvents.enviarGuess, guess)
  }
  enviarVeredicto(veredicto) {
    this.socket.emit(this.emitEvents.enviarVeredicto, veredicto)
  }
  enviarVictoria(gameId, userEmail) {
    this.socket.emit(this.emitEvents.juegoGanado, { gameId, userEmail });
  }
  enviarPerdida(gameId, userEmail) {
    this.socket.emit(this.emitEvents.juegoPerdido, { gameId, userEmail });
  }

  recibirDatosJuego() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.recibeDatosJuego, (datos) => {
        observer.next(datos);
      })
    })
  }
  recibirRespuesta() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.recibeRespuesta, (respuesta) => {
        observer.next(respuesta);
      })
    })
  }
  recibirPregunta() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.recibePregunta, (pregunta) => {
        observer.next(pregunta);
      })
    })
  }
  recibirGuess() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.recibeGuess, (guess) => {
        console.log(guess);
        observer.next(guess);
      })
    })
  }
  perderJuego() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.juegoPerdido, () => {
        observer.next();
      })
    })
  }
  ganarJuego() {
    return Observable.create((observer) => {
      this.socket.on(this.onEvents.juegoGanado, () => {
        observer.next();
      })
    })
  }
}
