const mongoose = require('../DB/mongodb-connection')
const DB = require('../DB/db');

class Partida extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            // uid: {
            //     type: String,
            //     unique: true
            // },
            jugador1:{ //correo
                type: String,
                required: true
            },
            jugador2: {
                type: String,
                required: true
            },
            ganador: {
                type: String,
                required: false
            },
            status: {
                type: Boolean,
                required: true
            },
            album: { //id del album
                type: String,
                required: true
            }
        });
        this._model = mongoose.model('Partida', this.schema);
    }
    
    async getPartidas() {
        return await super.query({})
    }

    async getPartidaById(uid, projection = "", options = {}) {
        return await super.queryOne({'_id':uid},projection,options);
    }
    async createPartida(jugador1, jugador2, album) {
        return await super.add({  'jugador1':jugador1,
                            'jugador2':jugador2,
                            'ganador': "",
                            'status':false,
                            'album': album
                        })
    }

    async putPartida(uid, game){
        let exists = await super.exists({
            '_id': uid
        })
        if (exists) {
            return await this.update({'_id': uid}, game);
        }
    }

    async deletePartida(conditions) {
        return await super.delete(conditions);
    }
}
let partida= new Partida();
module.exports = partida;