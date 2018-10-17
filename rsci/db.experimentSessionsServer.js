const debug = require('debug')('RSCI.db.experimentSessionsServer');

function init(provider) {

    var schema = new provider.Schema({
        experimentSessionId: String,
        experimentId: String,
        clients: Array,
        sessionStartTime: Date,
        sessionCompleted: Boolean,
        sessionCompletedTime: Date,
    });

    const model = provider.model('experimentSessionsServer', schema);

    async function save(data) {
        debug('save');
        await model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            data,
            { upsert: true, 'new': true }
        );
        await model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            { $addToSet: { clients: { $each: data.clients } } },
            { upsert: true }
        );
        return model.findOne({ experimentSessionId: data.experimentSessionId });
    }

    async function read(experimentSessionId) {
        debug('read');
        return model.findOne({ experimentSessionId: experimentSessionId });
    };

    async function getList() {
        debug('getList');
        return model.find({});
    };

    async function insertClientAction(experimentSessionId, clientId, clientAction) {
        debug('insertClientAction');
        return model.update(
            { "experimentSessionId": experimentSessionId, "clients.clientId": clientId },
            {
                "$push":
                {
                    "clients.$.actions": clientAction
                }
            },

        )
    }

    return {
        read: read,
        save: save,
        getList: getList,
        insertClientAction: insertClientAction,
    };
}
module.exports = init;