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
	allUsers;
	albums;
	fotos;
	juegos;
	juegosPendientes;
	amigos;
	resBusqueda = [];
	newGame;

	//Generar servicio que me traiga los datos relacionados al usuario.
	constructor(private usersService: UsersService, private authService: AuthService) { } //importar servicio

	ngOnInit(): void {
		// console.log(this.authService.getTokenData());
		let email = this.authService.getTokenData().email;
		this.user = this.usersService.getOneUser(email);
		this.allUsers = this.usersService.getAllUsers();
		this.albums = this.user.albums.map(a => this.usersService.getOneAlbum(a));
		this.fotos = this.user.fotos.map(f => this.usersService.getOneFoto(f));
		this.amigos = this.allUsers.filter(u => this.user.amigos.includes(u.email));

		this.juegos = this.user.historialPartidas.map(g => this.usersService.getOneGame(g));
		this.juegos.forEach(g => {
			if (g.jugador1 != this.user.email) {
				let temp = g.jugador1;
				g.jugador1 = this.user.email;
				g.jugador2 = temp;
			}
		})

		this.juegosPendientes = this.juegos.filter(g => !g.status);
		this.juegosPendientes.forEach(g => {
			g.jugador2 = this.amigos.find(a => a.email == g.jugador2);
		})


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
		this.albums = this.user.albums.map(a => this.usersService.getOneAlbum(a));
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
		let index = this.user.albums.findIndex(a => a == id)
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

		//eliminar de la lista del usuario que envió la invitacion
		let user2 = this.allUsers.find(u => u.email);
		if (user2) {
			user2.historialPartidas.findIndex(j => j == id);
			if (index >= 0) {
				user2.historialPartidas.splice(index, 1);
				this.usersService.updateUser(user2);
			}
		}
	}

	crearJuego(newGame) {

	}
}
