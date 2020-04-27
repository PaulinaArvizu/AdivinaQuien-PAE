const mongoose = require('../db/mongodb-connection')
const DB = require('../db/DB');

class Partida extends DB {
    constructor() {
        super();
        this.schema = new mongoose.Schema({
            uid: {
                type: Number,
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

    async declareWinner(uid, Jugador){
        let a  = await this.getPartidaById(uid);
        a.ganador = Jugador;
        a.status = true;
        return await super.update({'uid':uid}, u)
    }
}
let partida= new Partida();
module.exports = partida;