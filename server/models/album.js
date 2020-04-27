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
    async createAlbum( nombre, fotos = []) {
        return super.add({
            'nombre': nombre,
            'fotos': fotos
        })
    }

    async addPhoto(uid, photoId) {
        let u  = await this.getAlbumById(uid);
        u.fotos.push(photoId);
        return await super.update({'uid':uid}, u)
    }
    async putAlbum(uid, album){
        let exists = await super.exists({'uid': uid})
        if(exists){
            let a = await this.update({'uid': uid}, user)
            return a;
        }
    }
}
let album= new Album();
module.exports = album;