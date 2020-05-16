import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';

declare var $: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	//declarar datos
	user;
	allUsers = [];
	albums = [];
	fotos = [];
	juegos = [];
	amigos = [];
	resBusqueda = [];
	resBusquedaAmigos = [];
	buscar;
	newGame;

	//para modal de editar album y crear album
	tempAlbum = { nombre: '', fotos: [] };
	tempAlbumFotos = [];
	tempAlbumFotosFaltantes = [];
	editValid = false;

	//para el modal de editar usuario
	userEdit;

	//Generar servicio que me traiga los datos relacionados al usuario.
	constructor(private usersService: UsersService, private authService: AuthService) { } //importar servicio

	ngOnInit(): void {
		// console.log(this.authService.getTokenData());
		let email = this.authService.getTokenData().email;
		// console.log(email);
		this.user = this.usersService.getOneUser(email);
		// console.log(this.user);
		this.allUsers = this.usersService.getAllUsers();
		if (this.user.albumes) this.albums = this.user.albumes.map(a => this.usersService.getOneAlbum(a));
		// console.log("-----------------------------");
		// console.log(this.albums);
		// console.log(this.albums.length);
		// console.log("-----------------------------");
		if (this.user.fotos) this.fotos = this.user.fotos.map(f => this.usersService.getOneFoto(f));
		if (this.user.amigos) this.amigos = this.allUsers.filter(u => this.user.amigos.includes(u.email));

		if (this.user.historialPartidas) {
			this.juegos = this.user.historialPartidas.map(g => this.usersService.getOneGame(g));
			this.juegos.forEach(g => {
				if (g.jugador1 != this.user.email) {
					let temp = g.jugador1;
					g.jugador1 = this.user.email;
					g.jugador2 = temp;
				}
			})
		}
	}

	//funciones
	openNewGameModal() {
		$('#newGameModal').modal('show');
		this.userEdit = Object.assign({}, this.user);
	}

	openNewImgModal() {
		$('#newImgModal').modal('show');
	}

	openNewAlbumModal() {
		// console.log('------------------------------------------');
		$('#newAlbumModal').modal('show');
		this.tempAlbum = { nombre: '', fotos: [] };
		// console.log('------------------------------------------');
		// console.log(this.tempAlbum);
		this.tempAlbumFotos = [];
		this.tempAlbumFotosFaltantes = this.fotos.slice();
		this.resBusqueda = this.tempAlbumFotosFaltantes;
		this.editIsValid();
	}

	openEditAlbumModal(id) {
		$('#editAlbumModal').modal('show');
		this.tempAlbum = Object.assign({}, this.albums.find(a => a._id == id));
		this.tempAlbumFotos = this.fotos.filter(f => this.tempAlbum.fotos.includes(f._id));
		this.tempAlbumFotosFaltantes = this.fotos.filter(f => !this.tempAlbum.fotos.includes(f._id));
		this.resBusqueda = this.tempAlbumFotosFaltantes;
		this.editIsValid();

	}

	openEditUserModal() {
		$('#editUserModal').modal('show');
	}

	deleteFoto(id) {

		//eliminar de la lista del usuario
		let index = this.user.fotos.findIndex(f => f == id)
		if (index >= 0) {
			this.user.fotos.splice(index, 1);
			this.usersService.updateUser(this.user);
		} else return;

		//actualizar variables de ablums y fotos
		this.albums = this.user.albumes.map(a => this.usersService.getOneAlbum(a));
		this.fotos = this.user.fotos.map(f => this.usersService.getOneFoto(f));

		//eliminar la foto
		index = this.fotos.findIndex(f => f == id)
		if (index >= 0) {
			this.fotos.splice(index, 1);
			this.usersService.deleteFoto(id);
		}
	}

	deleteAlbum(id) {
		//eliminar de la lista del usuario
		let index = this.user.albumes.findIndex(a => a == id)
		if (index >= 0) {
			this.user.albumes.splice(index, 1);
		} else return;

		//eliminar los juegos con este album
		let indexList = [];
		this.juegos.forEach((juego, i) => {
			if (juego.album == id) {
				//eliminar del historial del usuario (se agrega a la lista de indices de juegos para no perder la cuenta en el forEach)
				indexList.push(i);

				//buscar al amigo de la partida
				let foundFriend = this.allUsers.find(u => u._id == juego.jugador2);
				if (foundFriend) {
					//eliminar del historial del amigo
					index = foundFriend.historialPartidas.findIndex(j => j == juego._id);
					foundFriend.historialPartidas.splice(index, 1);
					this.usersService.updateUser(foundFriend);
				}
			}
		})
		for(let i = indexList.length-1; i >= 0; i--) { //se eliminan de mayor indice a menor para no perder la posicion
			this.user.historialPartidas.splice(indexList[i], 1);
		}

		//eliminar el album
		index = this.albums.findIndex(a => a._id == id);
		if (index >= 0) {
			this.albums.splice(index, 1);
			this.usersService.updateUser(this.user);
			this.usersService.deleteAlbum(id);
		}
	}

	deleteFriend(email) {
		//eliminar de la lista del usuario
		let index = this.user.amigos.findIndex(a => a == email)
		if (index >= 0) {
			this.user.amigos.splice(index, 1);
			this.usersService.updateUser(this.user);
			this.amigos = this.allUsers.filter(u => this.user.amigos.includes(u.email));
		}
	}

	addFriend(email) {
		let index = this.user.amigos.findIndex(a => a == email) //buscar que no esté ya agregado
		if (index < 0) {
			this.user.amigos.push(email);
			this.usersService.updateUser(this.user);
			this.amigos = this.allUsers.filter(u => this.user.amigos.includes(u.email));
		}
	}

	aceptarJuego(id) {

	}

	rechazarJuego(id) {
		//eliminar de la lista del usuario
		let index = this.user.historialPartidas.findIndex(j => j == id);
		if (index >= 0) {
			this.user.historialPartidas.splice(index, 1);
			this.usersService.updateUser(this.user);
		} else return

		//buscar el juego
		let game = this.juegos.find(j => j._id == id);
		if (game) {
			this.usersService.deleteGame(id);
			//eliminar de la lista del usuario que envió la invitacion
			let user2 = this.allUsers.find(u => u.email == game.jugador2);
			if (user2) {
				user2.historialPartidas.findIndex(j => j == id);
				if (index >= 0) {
					user2.historialPartidas.splice(index, 1);
					this.usersService.updateUser(user2);
					this.allUsers = this.usersService.getAllUsers();

					//actualizar las listas de juegos
					this.juegos = this.user.historialPartidas.map(g => this.usersService.getOneGame(g));
					this.juegos.forEach(g => {
						if (g.jugador1 != this.user.email) {
							let temp = g.jugador1;
							g.jugador1 = this.user.email;
							g.jugador2 = temp;
						}
					})
				}
			}
		}
	}

	crearJuego(newGame) {
		// crear juego
		if (!newGame.jugador1 || !newGame.jugador2 || !newGame.album) return;
		let game = this.usersService.newGame(newGame);
		if (game) {
			this.user.historialPartidas.push(newGame._id);
			let user2 = this.allUsers.find(u => u.email == newGame.jugador2);
			if (user2) {
				user2.historialPartidas.push(newGame._id);
				this.usersService.updateUser(user2);
			}
		}
	}

	crearAlbum() {
		this.usersService.newAlbum(this.tempAlbum, this.user);
	}

	deleteFotoFromAlbum(fotoId) {
		//eliminar de la lista del album (temporal)

		let indexA = this.tempAlbum.fotos.findIndex(f => f == fotoId);
		let indexF = this.tempAlbumFotos.findIndex(f => f._id == fotoId);
		// console.log(indexA, indexF);
		if (indexA < 0 || indexF < 0) return;
		this.tempAlbum.fotos.splice(indexA, 1);
		this.tempAlbumFotosFaltantes.push(this.tempAlbumFotos.splice(indexF, 1)[0]);
		this.resBusqueda = this.tempAlbumFotosFaltantes;
		this.editIsValid();
		// console.log(this.tempAlbum);
	}

	addFotoToAlbum(fotoId) {
		let index = this.tempAlbumFotosFaltantes.findIndex(f => f._id == fotoId);
		if (index < 0) return;
		//quita la foto de las faltantes y la agrega a la de tempAlbumFotos
		this.tempAlbumFotos.push(this.tempAlbumFotosFaltantes.splice(index, 1)[0]);
		//agregar id de la foto a tempAlbum
		this.tempAlbum.fotos.push(fotoId);
		this.resBusqueda = this.tempAlbumFotosFaltantes;
		this.editIsValid();
	}

	buscarImagen() {
		this.resBusqueda = this.tempAlbumFotosFaltantes.filter(f => f.name.toUpperCase().includes(this.buscar.toUpperCase()));
	}

	editIsValid() {
		if (this.tempAlbum.nombre.length < 1 || this.tempAlbum.fotos.length < 2) this.editValid = false;
		else this.editValid = true;
	}

	saveEditAlbum() {
		// console.log("saveEdit");
		this.usersService.updateAlbum(this.tempAlbum);
	}

	buscarAmigo() {
		this.resBusquedaAmigos = this.allUsers.filter(f => f.name.toUpperCase().includes(this.buscar.toUpperCase()) && !this.user.amigos.includes(f));
	}

	atraparArchivo(event) {
		console.log(event);

	}
}
