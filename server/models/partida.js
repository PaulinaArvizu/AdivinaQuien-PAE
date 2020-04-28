const mongoose = require('../db/mongodb-connection')
const DB = require('../db/DB');

class Partida extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            uid: {
                type: String,
                unique: true
            },
            Jugador1:{ //correo
                type: String,
                unique: true
            },
            Jugador2: {
                type: String,
                required: true
            },
            ganador: {
                type: String,
                required: true
            },
            status: {
                type: Boolean,
                required: true
            },
            album: { //id del album
                type: Number,
                required: true
            }
        });
        this._model = mongoose.model('Partida', this.schema);
    }
    
    async getPartidas() {
        return await super.query({})
    }

    async getPartidaById(uid, projection = "", options = {}) {
        return await super.queryOne({'uid':uid},projection,options);
    }
    async createPartida(Jugador1, Jugador2, album) {
        return super.add({  'Jugador1':Jugador1,
                            'Jugador2':Jugador2,
                            'ganador':"",
                            'status':false,
                            'album': album
                        })
    }

    async putPartida(uid, game){
        let exists = await super.exists({
            'uid': uid
        })
        if (exists) {
            return await this.update({'uid': uid}, game);
        }
    }

    async deletePartida(conditions) {
        return await super.delete(conditions);
    }
}
let partida= new Partida();
module.exports = partida;