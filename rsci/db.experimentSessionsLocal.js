const debug = require('debug')('RSCI.db.experimentSessionsLocal');

function init(provider) {

    var schema = new provider.Schema({
        experimentSessionId: String,
        experimentId: String,
        experimentConfig: Object,
        clientId: String,
        sessionStartTime: String,
        actions: Array,
    });

    const model = provider.model('experimentSessionsLocal', schema);

    async function save(data) {
        debug('save');
        return model.findOneAndUpdate({ experimentSessionId: data.experimentSessionId }, data, { upsert: true, 'new': true });
    }

    async function read(experimentSessionId) {
        debug('read');
        return model.findOne({ experimentSessionId: experimentSessionId });
    }

    async function getList() {
        debug('getList');
        return model.find({});
    };
    
    return {
        read: read,
        save: save,
        getList: getList,
    };
}
module.exports = init;