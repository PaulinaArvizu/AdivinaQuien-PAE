const mongoose = require('../db/mongodb-connection')
const DB = require('../db/DB');
class Usuario extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            uid: {
                type: Number,
                unique: true
            },
            email:{
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
                type: String,
                required: true
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
    
    async getUserById(uid, projection = "", options = {}) {
        return await super.queryOne({'uid':uid},projection,options);
    }
    async getUserByEmail(email, projection = "", options = {}) {
        return await super.queryOne({'email':email},projection,options);
    }
    async exists(conditions) {
        let doc = await super.exists(conditions);
        return doc;
    }
    async createUser(email, password, nombre) {
        return super.add({  'email':email,
                            'password':password,
                            'nombre':nombre,
                            'fotoPerfil':'',
                            'historialPartidas':[],
                            'albumes':[],
                            'fotos':[],
                            'amigos':[]
                        })
    }

    async addPhoto(email, photoId) {
        let u  = await this.getUserByEmail(email);
        u.fotos.push(photoId);
        return await super.update({'email':email}, u)
    }

    async addAlbum(email, albumId) {
        let u  = await this.getUserByEmail(email);
        u.albumes.push(photoId);
        return await super.update({'email':email}, u)
    }

    async addFriend(email, friendEmail){
        let u  = await this.getUserByEmail(email);
        u.amigos.push(friendEmail)
        return await super.update({'email':email}, u)
    }
    async deleteFriend(email, friendEmail){
        let u  = await this.getUserByEmail(email);
        let i = u.amigos.findIndex((e) => e == friendEmail)
        u.amigos.splice(i,1)
        return await super.update({'email':email}, u)
    }
}
let usuario= new Usuario();
module.exports = usuario;