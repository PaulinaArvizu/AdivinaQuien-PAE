const mongoose = require('../DB/mongodb-connection')
const DB = require('../DB/db');
class Foto extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            // uid: {
            //     type: String,
            //     unique: true
            // },
            url: {
                type: String,
                unique: true
            },
            name: {
                type: String,
                required: true
            }
        });
        this._model = mongoose.model('Foto', this.schema);
    }

    async getPhotos() {
        return await super.query({})
    }

    async getPhotoById(uid, projection = "", options = {}) {
        return await super.queryOne({
            '_id': uid
        }, projection, options);
    }
    async exists(conditions) {
        return await super.exists(conditions);;
    }
    async createPhoto(url, name) {
        return await super.add({
            'url': url,
            'name': name
        })
    }
    async deletePhoto(conditions) {
        return await super.delete(conditions);
    }
}
let foto = new Foto();
module.exports = foto;