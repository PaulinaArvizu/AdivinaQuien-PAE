import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';

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
		this.makeHTTPRequest("api/users/"+user.email, "PUT", user, (xhr) => {
			if(xhr.status == 200) {
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

	deleteFoto(id) {
		let r;
		this.makeHTTPRequest("api/fotos/"+id, "DELETE", undefined, (xhr) => {
			if(xhr.status == 200) {
				console.log("Delete exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
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
		this.makeHTTPRequest("api/albums/"+album.id, "PUT", album, (xhr) => {
			if(xhr.status == 200) {
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
		this.makeHTTPRequest("api/albums/"+id, "DELETE", undefined, (xhr) => {
			if(xhr.status == 200) {
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
			if(xhr.status == 201) {
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
		this.makeHTTPRequest("api/partidas/"+game.id, "PUT", game, (xhr) => {
			if(xhr.status == 200) {
				console.log("Update exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en update");
			}
		});
		return r;
	}

	deleteGame(id) {
		let r;
		this.makeHTTPRequest("api/partidas/"+id, "DELETE", undefined, (xhr) => {
			if(xhr.status == 200) {
				console.log("Delete exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en delete");
			}
		});
		return r;
	}

	newGame(game) {
		let r;
		this.makeHTTPRequest("api/partidas/", "POST", game, (xhr) => {
			if(xhr.status == 201) {
				console.log("Post exitoso", JSON.parse(xhr.response));
				r = JSON.parse(xhr.response);
			} else {
				console.log("Error en post");
			}
		});
		return r;
	}
}
