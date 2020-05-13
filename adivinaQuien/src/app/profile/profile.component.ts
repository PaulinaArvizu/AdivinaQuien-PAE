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
	newGame;
	newAlbum;

	//Generar servicio que me traiga los datos relacionados al usuario.
	constructor(private usersService: UsersService, private authService: AuthService) { } //importar servicio

	ngOnInit(): void {
		// console.log(this.authService.getTokenData());
		let email = this.authService.getTokenData().email;
		console.log(email);
		this.user = this.usersService.getOneUser(email);
		console.log(this.user);
		this.allUsers = this.usersService.getAllUsers();
		if (this.user.albumes) this.albums = this.user.albumes.map(a => this.usersService.getOneAlbum(a));
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
			this.user.fotos.splice(index, 1);
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
		let album = this.usersService.newGame(newAlbum);
		if (newAlbum) {
			this.user.historialPartidas.push(newAlbum._id);
			let user2 = this.allUsers.find(u => u.email == newAlbum.jugador2);
			if (user2) {
				user2.historialPartidas.push(newAlbum._id);
				this.usersService.updateUser(user2);
			}
		}
	}
}
