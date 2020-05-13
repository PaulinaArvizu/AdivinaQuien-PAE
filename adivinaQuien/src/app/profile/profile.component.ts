import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	//declarar datos


	//Generar servicio que me traiga los datos relacionados al usuario.
	constructor() { } //importar servicio

	ngOnInit(): void {
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

	openEditAlbumModal() {
		$('#editAlbumModal').modal('show');
	}

	openEditUserModal() {
		$('#editUserModal').modal('show');
	}

}
