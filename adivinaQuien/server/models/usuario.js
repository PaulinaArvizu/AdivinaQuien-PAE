const mongoose = require('../DB/mongodb-connection')
const DB = require('../DB/db');
class Usuario extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            email: {
                type: String,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            nombre: {
                type: String,
                required: true
            },
            fotoPerfil: {
                type: String
            },
            historialPartidas: {
                type: Array,
                required: true
            },
            albumes: {
                type: Array,
                required: true
            },
            fotos: {
                type: Array,
                required: true
            },
            amigos: {
                type: Array,
                required: true
            }
        });
        this._model = mongoose.model('Usuario', this.schema);
    }

    async getUsers() {
        return await super.query({})
    }

    async getUserByEmail(email, projection = "", options = {}) {
        return await super.queryOne({
            'email': email
        }, projection, options);
    }
    async exists(conditions) {
        return await super.exists(conditions);
    }
    async createUser(email, password, nombre) {
        if (!email || !password || !nombre) {
            return undefined;
        }
        let newUser = {
            'email': email,
            'password': password,
            'nombre': nombre,
            'fotoPerfil': '',
            'historialPartidas': [],
            'albumes': [],
            'fotos': [],
            'amigos': []
        };
        console.log(newUser);
        return super.add(newUser);
    }

    async putUser(email, user) {
        let exists = await super.exists({
            'email': email
        })
        if (exists) {
            user.email = email;//asegurar que el email no cambie
            return await this.update({'email': email}, user);
        }
    }
}
let usuario = new Usuario();
module.exports = usuario;