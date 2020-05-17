import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketIoService } from '../socket-io.service';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';


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
    email: "",
    password: "",
    nombre: "Yo",
    fotoPerfil: "",
    historialPartidas: "",
    albumes: [],
    fotos: []
  };
  myImg = {
    _id: "",
    url: "",
    name: ""
  };
  selectedImg = {
    _id: "",
    url: "",
    name: ""
  };
  album: {
    _id: "",
    url: "",
    name: ""
  }[] = [];
  game = {
    _id: "",
    jugador1: "",
    jugador2: "",
    ganador: null,
    status: this.gameStatus.pendiente,
    album: ""
  };
  guessVeredict: boolean = false;
  myTurn: boolean;
  contrincante = {
    email: "",
    password: "",
    nombre: "El otro",
    fotoPerfil: "",
    historialPartidas: "",
    albumes: [],
    fotos: []
  };


  constructor(private socketIOservice: SocketIoService, private userService: UsersService, private auth: AuthService, private route: ActivatedRoute) { }
  private subDatos: Subscription;
  private subGuess: Subscription;
  private subPregunta: Subscription;
  private subGanar: Subscription;
  private subRespuesta: Subscription;
  private subPerder: Subscription;
  ngOnInit(): void {
    this.subDatos = this.socketIOservice.recibirDatosJuego().subscribe((datos) => {
      this.game = datos;
      this.myTurn = this.jugador.email != this.game.jugador1;
      let album2 = this.userService.getOneAlbum(this.game.album)
      this.album =  album2.fotos.map(e => this.userService.getOneFoto(e))
      this.myImg = this.album[parseInt(Math.random() * this.album.length)];
      if (this.jugador.email === this.game.jugador1) {
        this.contrincante = this.userService.getOneUser(this.game.jugador2)
      } else {
        console.log(this.game.jugador1);
        this.contrincante = this.userService.getOneUser(this.game.jugador1)
      }
    });
    this.subGuess = this.socketIOservice.recibirGuess().subscribe((guess) => {
      this.myTurn = true
      console.log(guess);
      let adivino = this.myImg._id == guess._id;
      if (adivino) {
        alert('perdiste')
        this.socketIOservice.enviarVeredicto({ gameId: this.game._id, userEmail: this.contrincante.email, adivino })
      }

    });
    this.subPregunta = this.socketIOservice.recibirPregunta().subscribe((pregunta: string) => {
      this.msgChat.push({
        recibida: true,
        pregunta: pregunta
      })
    });
    this.subRespuesta = this.socketIOservice.recibirRespuesta().subscribe((resp) => {
      this.msgChat.push({
        recibida: true,
        pregunta: resp
      })
      
    });
    this.subPerder = this.socketIOservice.perderJuego().subscribe(() => {
      console.log('perder')
    });
    this.subGanar = this.socketIOservice.ganarJuego().subscribe(() => {
      console.log('ganar');
    });
    // this.jugador = this.userService.getOneUser(this.auth.getTokenData().email)
    console.log(this.route.snapshot.paramMap.get('id'));
    this.socketIOservice.entrarAlJuego(this.route.snapshot.paramMap.get('id'));
    this.jugador = this.userService.getOneUser(this.auth.getTokenData().email)
    
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
    if (event.keyCode != 13 || !this.myTurn) return;
    this.myTurn = false;
    this.socketIOservice.enviarPregunta({ gameId: this.game._id, mensaje: this.msgSend.trim() })
    // console.log(this.msgSend)
    this.msgChat.push({
      recibida: false,
      pregunta: this.msgSend.trim()
    })
    this.msgSend = ''
  }
  enviarGuess() {
    if (!this.myTurn) return;
    this.myTurn = false;
    let a = { gameId: this.game._id, img: this.selectedImg }
    this.socketIOservice.enviarGuess(a);
  }

  enviarRespuesta(resp: string) {
    if(!this.myTurn) return;
    this.msgChat.push({
      recibida: false,
      pregunta: resp
    })
    this.socketIOservice.enviarRespuesta({ gameId: this.game._id, respuesta: resp })
    this.myTurn = true
  }

  seleccionarImagen(img: { _id: "", url: "", name: "" }) {
    this.selectedImg = img;
  }
  
}
