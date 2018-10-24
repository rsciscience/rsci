const debug = require('debug')('RSCI.db.experimentSessionsServer')


class experimentSessionsServer {
    constructor(provider) {
        this.schema = new provider.Schema({
            experimentSessionId: String,
            experimentId: String,
            clients: Array,
            sessionStartTime: Date,
            sessionCompleted: Boolean,
            sessionCompletedTime: Date,
        })
        this.model = provider.model('experimentSessionsServer', this.schema)
    }

    async save(data) {
        debug('save')
        await this.model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            data,
            { upsert: true, 'new': true }
        )
        await this.model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            { $addToSet: { clients: { $each: data.clients } } },
            { upsert: true }
        )
        return this.model.findOne({ experimentSessionId: data.experimentSessionId })
    }

    async read(experimentSessionId) {
        debug('read')
        return this.model.findOne({ experimentSessionId: experimentSessionId })
    }

    async getList() {
        debug('getList')
        return this.model.find({})
    }

    async insertClientAction(experimentSessionId, clientId, clientAction) {
        debug('insertClientAction')
        return this.model.update(
            { "experimentSessionId": experimentSessionId, "clients.clientId": clientId },
            {
                "$push":
                {
                    "clients.$.actions": clientAction
                }
            },
        )
    }
}

module.exports = experimentSessionsServer
