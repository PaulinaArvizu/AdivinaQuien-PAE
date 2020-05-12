const mongoose = require('./mongodb-connection');
mongoose.set('useFindAndModify', false);

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
    async delete(query) {
        let a = await this.queryOne(query)
        await this._model.deleteOne(query);
        return a;
    }
}

module.exports = DB;