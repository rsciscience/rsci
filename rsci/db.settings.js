const debug = require('debug')('RSCI.db.settings');

const helpers = require('./helpers');

function init(db, provider) {
    this.db = db;

    var schema = new provider.Schema({
        clientId : String,
        isServer: Boolean
    });

    const model = provider.model('settings', schema);

    function save(data, cb) {
        debug('save');

        function readCB(settings){
            console.log('readCB');
            if (settings == null){
                settings = new model(data);
                settings.save(function(err, data) {
                    cb(data);
                });
            }
            var savedata =  {};
            Object.assign(savedata, settings._doc, data);

            function saved(err, data){
                console.log('saved');
                console.log(err, data)
                if (err) { debug('errorSavings', err); return  }

                cb(data);
            }
            console.log(savedata)
            model.update(savedata).then(saved);

        }

        read(readCB);
    }

    function read(cb) {
        
        debug('read');
        model.findOne({}, function (err, data) {
            console.log(err, data)
            if (err) { debug(err); return; }
                cb(data);
            }
        );
    }

    return {
        read: read,
        save: save,
    };
}

module.exports = init;