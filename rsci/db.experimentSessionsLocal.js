const debug = require('debug')('RSCI.db.experimentSessionsLocal')

class experimentSessionsLocal {
    constructor (provider) {
        this.schema = new provider.Schema({
            experimentSessionId: String,
            experimentId: String,
            experimentConfig: Object,
            clientId: String,
            sessionStartTime: String,
            actions: Array,
        })
        this.model = provider.model('experimentSessionsLocal', this.schema)
    }

    async save(data) {
        debug('save')
        return this.model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId }, 
            data, 
            { upsert: true, 'new': true }
        )
    }

    async read(experimentSessionId) {
        debug('read')
        return this.model.findOne({ experimentSessionId: experimentSessionId })
    }

    async getList() {
        debug('getList')
        return this.model.find({})
    }
}

module.exports = experimentSessionsLocal
