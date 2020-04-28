const mongoose = require('./mongodb-connection');

class DB {
    async query(query, projection = {}, options = {}) {
        return await this._model.find(query, projection, options);
    }
    async queryOne(query, projection = {}, options = {}) {
        return await this._model.findOne(query, projection, options);
    }
    async update(query, dataObject) {
        return await this._model.findOneAndUpdate(query, {
            $set: dataObject
        }, {
            new: true
        })
    }
    async exists(query) {
        return await this._model.exists(query);
    }
    async add(document) {
        return await this._model.insertMany([document]);
    }
    async delete(query){
        return await this._model.deleteOne(query);
    }
}

module.exports = DB;