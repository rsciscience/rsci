const debug = require('debug')('RSCI.db.settings');


class settings {
    constructor(provider) {
        this.schema = new provider.Schema({
            clientId: String,
            isServer: Boolean
        })
        this.model = provider.model('settings', this.schema)
    }

    async save(data) {
        debug('save')
        return this.model.findOneAndUpdate({}, data, { upsert: true, 'new': true })
    }

    async read() {
        debug('read')
        return this.model.findOne({})
    }
}

module.exports = settings;
