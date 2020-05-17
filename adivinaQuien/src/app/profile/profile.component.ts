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
	buscar = '';
	newGame = {
		jugador1: '',
		jugador2: '',
		ganador: '',
		status: false,
		album: ''
	};

	//para modal de editar album y crear album
	tempAlbum = { nombre: '', fotos: [] };
	tempAlbumFotos = [];
	tempAlbumFotosFaltantes = [];
	editValid = false;

	//para el modal de editar usuario
	userEdit;

	//para el modal de juego nuevo
	newGameValid = false;

	//para agregar una foto
	selectedFile: File;

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

		if (this.user.fotos) this.fotos = this.user.fotos.map(f => this.usersService.getOneFoto(f));
		if (this.user.amigos) this.amigos = this.allUsers.filter(u => this.user.amigos.includes(u.email));

		if (this.user.historialPartidas.length > 0) {
			this.juegos = this.user.historialPartidas.map(g => this.usersService.getOneGame(g));
			this.juegos.forEach(g => {
				if (g.jugador1 != this.user.email) {
					g.jugador2 = g.jugador1;
					g.jugador1 = this.user.email;
				}
				g.jugador1 = this.usersService.getOneUser(g.jugador1);
				g.jugador2 = this.usersService.getOneUser(g.jugador2);
			})
			console.log(this.juegos);
		}
	}

	//funciones
	openNewGameModal() {
		$('#newGameModal').modal('show');
		this.newGame = {
			jugador1: this.user.email,
			jugador2: '',
			ganador: '',
			status: false,
			album: ''
		};
		this.newGameValid = false;
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
		this.userEdit = Object.assign({}, this.user);
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
		let canDelete = true;
		this.juegos.forEach(j => {
			if(j.album == id && !j.status) canDelete = false;
		})

		if(!canDelete) {
			$('#errorDeleteAlbumModal').modal('show');
			return;
		}

		//eliminar de la lista del usuario
		let index = this.user.albumes.findIndex(a => a == id)
		if (index >= 0) {
			this.user.albumes.splice(index, 1);
		} else return;

		//eliminar el album
		index = this.albums.findIndex(a => a._id == id);
		if (index >= 0) {
			this.albums.splice(index, 1);
			this.usersService.updateUser(this.user);
			this.usersService.deleteAlbum(id);
		}
	}

	deleteFriend(amigo) {
		//eliminar de la lista del usuario
		let index = this.user.amigos.findIndex(a => a == amigo.email);
		if (index >= 0) {
			this.user.amigos.splice(index, 1);

			index = amigo.amigos.findIndex(a => a == this.user.email);
			if (index >= 0) {
				amigo.amigos.splice(index, 1);
				this.usersService.updateUser(this.user);
				this.usersService.updateUser(amigo);
			}
		}
	}

	addFriend(amigo) {
		// console.log(amigo);
		let index = this.user.amigos.findIndex(a => a == amigo.email) //buscar que no esté ya agregado
		if (index < 0) {
			this.user.amigos.push(amigo.email);
			amigo.amigos.push(this.user.email);
			this.usersService.updateUser(this.user);
			this.usersService.updateUser(amigo);
		}
	}

	aceptarJuego(id) {

	}

	rechazarJuego(id) {
		//buscar el juego
		let game = this.usersService.getOneGame(id);
		if (game) {
			this.usersService.deleteGame(id, game.jugador1, game.jugador2);
		}
	}

	crearJuego(newGame) {
		// crear juego
		let user2 = this.allUsers.find(u => u.email == newGame.jugador2);
		this.usersService.newGame(newGame, this.user, user2);
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
		this.buscar = '';
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
		// console.log(this.buscar);
		this.resBusquedaAmigos = this.allUsers.filter(f => {
			return (f.nombre.toUpperCase().includes(this.buscar.toUpperCase()) ||
				f.email.toUpperCase().includes(this.buscar.toUpperCase()))
				&& !this.user.amigos.includes(f.email)
				&& this.user.email != f.email;
		});
		this.buscar = '';
	}

	onFileChanged(event) {
		this.selectedFile = event.target.files[0];
		console.log(this.selectedFile);
	}

	newGameSelectedAlbum(albumId) {
		if (this.newGame.album == albumId) this.newGame.album = '';
		else this.newGame.album = albumId;
		this.newGameIsValid();
	}

	newGameSelectedFriend(email) {
		if (this.newGame.jugador2 == email) this.newGame.jugador2 = '';
		else this.newGame.jugador2 = email;
		this.newGameIsValid();
	}

	newGameIsValid() {
		this.newGameValid = this.newGame.album != '' && this.newGame.jugador2 != '';
	}

}
