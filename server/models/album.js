const mongoose = require('../db/mongodb-connection')
const DB = require('../db/DB');
class Album extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            uid: {
                type: Number,
                unique: true 
            },
            ownerEmail:{
                type: String,
                required:true
            },
            nombre: {
                type: String,
                required: true
            },
            fotos: {
                type: Array,
                required: true
            }
        });
        this._model = mongoose.model('Album', this.schema);
    }
    
    async getAlbumById(uid, projection = "", options = {}) {
        return await super.queryOne({'uid':uid},projection,options);
    }
    async getAlbumsByEmail(email, projection = "", options = {}) {
        return await super.query({'email':email},projection,options);
    }
    async createAlbum(ownerEmail, nombre, fotos = []) {
        return super.add({
            'ownerEmail':ownerEmail,
            'nombre': nombre,
            'fotos': fotos
        })
    }

    async addPhoto(uid, photoId) {
        u  = await this.getAlbumById(uid);
        u.fotos.push(photoId);
        return await super.update({'uid':uid}, u)
    }
}
let usuario= new Usuario();
module.exports = usuario;