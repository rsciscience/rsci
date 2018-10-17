const debug = require('debug')('RSCI.db.settings');

function init(provider) {

    var schema = new provider.Schema({
        clientId: String,
        isServer: Boolean
    });

    const model = provider.model('settings', schema);

    async function save(data) {
        debug('save');
        return model.findOneAndUpdate({}, data, { upsert: true, 'new': true });
    }

    async function read() {
        debug('read');
        return model.findOne({});
    }

    return {
        read: read,
        save: save,
    };
}

module.exports = init;