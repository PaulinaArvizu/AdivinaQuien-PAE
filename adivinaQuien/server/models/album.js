const mongoose = require('../DB/mongodb-connection')
const DB = require('../DB/db');
class Album extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
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
    
    async getAlbums() {
        return await super.query({})
    }

    async getAlbumById(uid, projection = "", options = {}) {
        return await super.queryOne({'_id':uid}, projection, options);
    }
    async createAlbum(nombre, fotos) {
        return super.add({
            'nombre': nombre,
            'fotos': fotos
        })
    }

    async putAlbum(uid, album){
        let exists = await super.exists({'_id': uid})
        if(exists){
            return await this.update({'_id': uid}, album);
        }
    }

    async deleteAlbum(conditions) {
        return await super.delete(conditions);
    }
}
let album = new Album();
module.exports = album;