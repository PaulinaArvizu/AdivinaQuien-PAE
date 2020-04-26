const mongoose = require('../db/mongodb-connection')
const DB = require('../db/DB');
class Foto extends DB {
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
            url:{
                type: String,
                unique: true
            },
            name: {
                type: String,
                required: true
            }
        });
        this._model = mongoose.model('Usuario', this.schema);
    }
    
    async getPhotoById(uid, projection = "", options = {}) {
        return await super.queryOne({'uid':uid},projection,options);
    }
    async getPhotosByEmail(email, projection = "", options = {}) {
        return await super.query({'ownerEmail':email},projection,options);
    }
    async exists(conditions) {
        let doc = await super.exists(conditions);
        return doc;
    }
    async addPhoto(url, name, ownerEmail){
        return await super.add({'url':url, 'name':name, 'ownerEmail':ownerEmail})
    }
}
let foto= new Foto();
module.exports = foto;