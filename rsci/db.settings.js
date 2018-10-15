const debug = require('debug')('RSCI.db.settings');

const helpers = require('./helpers');

function init(db, provider) {
    this.db = db;

    var schema = new provider.Schema({
        clientId: String,
        isServer: Boolean
    });

    const model = provider.model('settings', schema);

    function save(data, cb) {
        debug('save');
        model.findOneAndUpdate({}, data,
            { upsert: true, 'new': true },
            function (err, newData) {
                if (err) { debug('error Saving', err); return; }
                cb(newData);
            });
    }

    function read(cb) {
        debug('read');
        model.findOne({},
            function (err, data) {
                if (err) { debug(err); return; }
                cb(data);
            });
    }

    return {
        read: read,
        save: save,
    };
}

module.exports = init;