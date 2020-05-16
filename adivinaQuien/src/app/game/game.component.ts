import { Component, OnInit, OnDestroy} from '@angular/core';
import { SocketIoService } from '../socket-io.service';
import { Subscription } from 'rxjs';

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
    Jugador1: {
      correo: "",
      password: "",
      nombre: "",
      fotoPerfil: "",
      historialPartidas: "",
      albumes: [],
      fotos: []
    },
    Jugador2: {
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
  private subDatos: Subscription;
  private subGuess: Subscription;
  private subPregunta: Subscription;
  private subGanar: Subscription;
  private subRespuesta: Subscription;
  private subPerder: Subscription;
  ngOnInit(): void {
    this.subDatos = this.socketIOservice.recibirDatosJuego().subscribe((datos) => {
      this.game = datos;

      this.myTurn = this.jugador.correo == this.game.Jugador2.correo;

    });
    this.subGuess = this.socketIOservice.recibirGuess().subscribe((guess) => {
      console.log('recibiendo guess')
      this.myTurn = true
      let win = this.myImg !=guess;
      if(win){
        console.log('Victoria')
      } else {
        console.log('Derrota');
      }
      this.socketIOservice.enviarVeredicto({gameId:this.game.id, userEmail: this.jugador.correo, win})
    });
    this.subPregunta = this.socketIOservice.recibirPregunta().subscribe((pregunta: string) => {
      
      this.msgChat.push({
        recibida: true,
        pregunta: pregunta
      })
      
    });
    this.subRespuesta = this.socketIOservice.recibirRespuesta().subscribe((resp)=>{
      console.log(resp);
      if(resp == 'yes'){

      } else {

      }
    });
    this.subPerder = this.socketIOservice.perderJuego().subscribe(() => {
      console.log('perder')
      // this.game.
    });
    this.subGanar = this.socketIOservice.ganarJuego().subscribe(()=>{
      console.log('ganar');
    });
    this.socketIOservice.entrarAlJuego(0);
  }

  ngOnDestroy() {
    this.subDatos.unsubscribe();
    this.subGanar.unsubscribe();
    this.subGuess.unsubscribe();
    this.subPerder.unsubscribe();
    this.subPregunta.unsubscribe();
    this.subRespuesta.unsubscribe();
  }

  enviarMensaje(event) {
    if (event.keyCode != 13) return;
    this.socketIOservice.enviarPregunta({gameId:this.game.id,mensaje:this.msgSend})
    // console.log(this.msgSend)
    this.msgChat.push({
      recibida: false,
      pregunta: this.msgSend
    })
    this.msgSend = ''
  }
  enviarGuess(){
    // if(!this.myTurn) return;
    console.log('Mandando guess')
    this.myTurn = false;
    let a = {gameId: this.game.id, img:this.selectedImg}
    this.socketIOservice.enviarGuess(a);
  }

  enviarRespuesta(resp: string){
    this.socketIOservice.enviarRespuesta({gameId:this.game.id,respuesta:resp})
  }

  seleccionarImagen(imgUrl: string){
    this.selectedImg = imgUrl;
  }
  disable(event){
    console.log(event);
  }
}
