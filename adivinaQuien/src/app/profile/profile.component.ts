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

	//Generar servicio que me traiga los datos relacionados al usuario.
	constructor(private usersService: UsersService, private authService: AuthService) { } //importar servicio

	ngOnInit(): void {
		// console.log(this.authService.getTokenData());
		let email = this.authService.getTokenData().email;
		this.user = this.usersService.getOneUser(email);
		this.allUsers = this.usersService.getAllUsers();
		this.albums = this.user.albums.map(a => this.usersService.getOneAlbum(a));
		this.fotos = this.user.fotos.map(f => this.usersService.getOneFoto(f));
		this.juegos = this.user.historialPartidas.map(g => this.usersService.getOneGame(g));
		
		this.juegos.forEach(g => {
			if(g.jugador1 != this.user.email) {
				let temp = g.jugador1;
				g.jugador1 = this.user.email;
				g.jugador2 = temp;
			}
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
		
	}

	deleteAlbum(id) {
		
	}
}
