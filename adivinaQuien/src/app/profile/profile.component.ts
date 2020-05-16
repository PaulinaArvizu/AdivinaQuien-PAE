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
	buscar;
	newGame;
	newAlbum;

	//para modal de editar album y crear album
	tempAlbum;
	tempAlbumFotos = [];
	tempAlbumFotosFaltantes = [];
	editValid = false;

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
	}

	openNewImgModal() {
		$('#newImgModal').modal('show');
	}

	openNewAlbumModal() {
		$('#newAlbumModal').modal('show');
	}

	openEditAlbumModal(id) {
		$('#editAlbumModal').modal('show');
		this.tempAlbum = Object.assign({}, this.albums.find(a => a._id == id));
		this.tempAlbumFotos = this.fotos.filter(f => this.tempAlbum.fotos.includes(f._id));
		// this.tempAlbumFotos = this.tempAlbum.fotos.map(af => this.fotos.find(f => f._id == af));
		this.tempAlbumFotosFaltantes = this.fotos.filter(f => !this.tempAlbum.fotos.includes(f._id));
		// console.log(this.tempAlbum, this.tempAlbumFotos, this.tempAlbumFotosFaltantes);
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
			this.usersService.updateUser(this.user);
		} else return;

		//eliminar el album
		index = this.albums.findIndex(a => a == id)
		if (index >= 0) {
			this.albums.splice(index, 1);
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

	nuevoAlbum(newAlbum) {
		if (newAlbum.fotos.length <= 0 || !newAlbum.nombre) return;
		let album = this.usersService.newAlbum(newAlbum);
		if (newAlbum) {
			this.user.historialPartidas.push(newAlbum._id);
			let user2 = this.allUsers.find(u => u.email == newAlbum.jugador2);
			if (user2) {
				user2.historialPartidas.push(newAlbum._id);
				this.usersService.updateUser(user2);
			}
		}
	}

	deleteFotoFromAlbum(fotoId) {
		//eliminar de la lista del album (temporal)
		
		let indexA = this.tempAlbum.fotos.findIndex(f => f == fotoId);
		let indexF = this.tempAlbumFotos.findIndex(f => f._id == fotoId);
		console.log(indexA, indexF);
		if (indexA < 0 || indexF < 0) return;
		this.tempAlbum.fotos.splice(indexA, 1);
		this.tempAlbumFotosFaltantes.push(this.tempAlbumFotos.splice(indexF, 1)[0]);
		this.resBusqueda = this.tempAlbumFotosFaltantes;
		this.editIsValid();
		// console.log(this.tempAlbum);
	}

	addFotoToAlbum(fotoId) {
		let index = this.tempAlbumFotosFaltantes.findIndex(f => f._id == fotoId);
		if(index < 0) return;
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
		if(this.tempAlbum.nombre.length < 1 || this.tempAlbum.fotos.length < 2) this.editValid = false;
		else this.editValid = true;
	}

	saveEditAlbum() {
		// console.log("saveEdit");
		this.usersService.updateAlbum(this.tempAlbum);
	}
}
