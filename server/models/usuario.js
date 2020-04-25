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
            }
        });
        this._model = mongoose.model('Usuario', this.schema);
    }
    
    async getProductById(uid, projection = "", options = {}) {
        return await super.queryOne({'uid':uid},projection,options);
    }
    async getUserByEmail(email, projection = "", options = {}) {
        return await super.queryOne({'email':email},projection,options);
    }
    async exists(conditions) {
        let doc = await super.exists(conditions);
        return doc;
    }
}
let usuario= new Usuario();
module.exports = usuario;