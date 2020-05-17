import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class UsersService {

	constructor(private http: HttpClient) { }
	// requests
	httpGet(url) {
		let xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, false); // false for synchronous request
		xmlHttp.send(null);
		return JSON.parse(xmlHttp.responseText);
	}

	makeHTTPRequest(endpoint, method, data, callback) {
		console.log(method);
		let headers;
		if (method == 'DELETE')
			headers = '';
		else
			headers = { 'Content-Type': 'application/json' };
		// 1. crear XMLHttpRequest object
		let xhr = new XMLHttpRequest();
		// 2. configurar: PUT actualizar archivo
		xhr.open(method, endpoint);
		for (let key in headers) {
			xhr.setRequestHeader(key, headers[key]);
			xhr.setRequestHeader
		}
		// 4. Enviar solicitud
		// console.log(data);
		// console.log(headers);
		xhr.send(JSON.stringify(data));
		// 5. Una vez recibida la respuesta del servidor
		xhr.onload = () => callback(xhr);
	}


	//CRUD usuarios
	getOneUser(email) {
		// return this.http.get("/api/users/" + email).toPromise(); //regresa la funcion como promesa (buena practica)
		let r = this.httpGet("api/users/" + email);
		// console.log(r);
		return r;
	}

	getAllUsers() {
		// return this.http.get("/api/users").toPromise();
		return this.httpGet("api/users/");
	}

	updateUser(user) {
		let r;
		this.makeHTTPRequest("api/users/" + user.email, "PUT", user, (xhr) => {
			if (xhr.status == 200) {
				console.log("Update exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
				location.reload();
			} else {
				console.log("Error en update");
			}
		});
		return r;
	}

	//CRUD fotos
	getOneFoto(id) {
		// return this.http.get("api/fotos/" + id).toPromise();
		return this.httpGet("api/fotos/" + id);
	}

	getAllFotos() {
		// return this.http.get("/api/fotos").toPromise();
		return this.httpGet("api/fotos/");
	}

	createFoto(form: NgForm, selectedFile, user) {
		let formData = new FormData();
		formData.append("image", selectedFile);
		formData.append("name", form.value.name);
		this.http.post('/api/fotos', formData).subscribe(
			(res) => {
				console.log(res);
				if (res[0]) {
					user.fotos.push(res[0]._id);
					this.updateUser(user);
				}
			});
	}

	profileFoto(form: NgForm, selectedFile, user, currProfileFoto) {
		if (user.fotoPerfil == '') { //el usuario todavia no tiene foto de perfil
			//crear la foto
			let formData = new FormData();
			formData.append("image", selectedFile);
			formData.append("name", user._id);
			this.http.post('/api/fotos', formData).subscribe(
				(res) => {
					console.log(res);
					if (res[0]) {
						//poner foto de perfil
						user.fotoPerfil = res[0].url;
						this.updateUser(user);
					}
				});
		} else {
			let r;
			console.log(currProfileFoto);
			this.makeHTTPRequest("api/fotos/" + currProfileFoto._id, "DELETE", undefined, (xhr) => {
				if (xhr.status == 200) {
					console.log("Delete exitoso", JSON.parse(xhr.response));
					r = JSON.parse(xhr.response);
					//crear la foto
					let formData = new FormData();
					formData.append("image", selectedFile);
					formData.append("name", user._id);
					this.http.post('/api/fotos', formData).subscribe(
						(res) => {
							console.log(res);
							if (res[0]) {
								//poner foto de perfil
								user.fotoPerfil = res[0].url;
								this.updateUser(user);
							}
						});
				} else {
					console.log("Error en delete");
				}
			});
		}
	}

	deleteFoto(id, user) {
		let r;
		this.makeHTTPRequest("api/fotos/" + id, "DELETE", undefined, (xhr) => {
			if (xhr.status == 200) {
				console.log("Delete exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
				//eliminar de los albums donde esté presente
				let albums = this.getAllAlbums();
				albums.forEach(a => {
					let indexF = a.fotos.findIndex(f => f == id);
					if(indexF >= 0) {
						a.fotos.splice(indexF, 1);
						this.updateAlbum(a);
					}
				});

				let index = user.fotos.findIndex(f => f == id)
				if (index >= 0) {
					user.fotos.splice(index, 1);
					this.updateUser(user);
				}
			} else {
				console.log("Error en delete");
			}
		});
		return r;
	}

	//CRUD albums
	getOneAlbum(id) {
		return this.httpGet("api/albums/" + id);
	}

	getAllAlbums() {
		// return this.http.get("api/albums/").toPromise();
		return this.httpGet("api/albums/");
	}

	updateAlbum(album) {
		let r;
		this.makeHTTPRequest("api/albums/" + album.id, "PUT", album, (xhr) => {
			if (xhr.status == 200) {
				console.log("Update exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en update");
			}
		});
		return r;
	}

	deleteAlbum(id) {
		let r;
		this.makeHTTPRequest("api/albums/" + id, "DELETE", undefined, (xhr) => {
			if (xhr.status == 200) {
				console.log("Delete exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en delete");
			}
		});
		return r;
	}

	// newAlbum(album) {
	// 	let r;
	// 	this.makeHTTPRequest("api/albums/", "POST", album, (xhr) => {
	// 		// console.log(xhr.status);
	// 		if(xhr.status == 201) {
	// 			console.log("Post exitoso", JSON.parse(xhr.response));
	// 			r = JSON.parse(xhr.response);
	// 			return r;
	// 		} else {
	// 			console.log("Error en post");
	// 		}
	// 	});
	// 	console.log("r = ",r);
	// 	// return r;
	// }

	newAlbum(album, user) {
		let r;
		this.makeHTTPRequest("api/albums/", "POST", album, (xhr) => {
			// console.log(xhr.status);
			if (xhr.status == 201) {
				console.log("Post exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
				user.albumes.push(r[0]._id);
				// console.log("r = ", r);
				// console.log("r._id = ", r[0]._id);
				// console.log("updated user = ", user);
				// console.log("updated user.albumes = ", user.albumes);
				this.updateUser(user);
			} else {
				console.log("Error en post");
			}
		});
	}

	//CRUD juegos
	getOneGame(id) {
		return this.httpGet("api/partidas/" + id);
	}

	getAllGames() {
		// return this.http.get("api/albums/").toPromise();
		return this.httpGet("api/albpartidasums/");
	}

	updateGame(game) {
		let r;
		this.makeHTTPRequest("api/partidas/" + game.id, "PUT", game, (xhr) => {
			if (xhr.status == 200) {
				console.log("Update exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en update");
			}
		});
		return r;
	}

	deleteGame(id, user1, user2) {
		let r;
		this.makeHTTPRequest("api/partidas/" + id, "DELETE", undefined, (xhr) => {
			if (xhr.status == 200) {
				console.log("Delete exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
				let index1 = user1.historialPartidas.findIndex(j => j == id);
				let index2 = user2.historialPartidas.findIndex(j => j == id);
				if (index1 >= 0 && index2 >= 0) {
					user1.historialPartidas.splice(index1, 1);
					user2.historialPartidas.splice(index2, 1);
					this.updateUser(user1);
					this.updateUser(user2);
				}
			} else {
				console.log("Error en delete");
			}
		});
		return r;
	}

	newGame(game, user1, user2) {
		let r;
		this.makeHTTPRequest("api/partidas/", "POST", game, (xhr) => {
			if (xhr.status == 201) {
				console.log("Post exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
				// console.log(r[0]);
				user1.historialPartidas.push(r[0]._id);
				user2.historialPartidas.push(r[0]._id);
				this.updateUser(user1);
				this.updateUser(user2);
			} else {
				console.log("Error en post", xhr.response);
			}
		});
		return r;
	}
}
