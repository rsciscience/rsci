const debug = require('debug')('RSCI.db.experimentSessions');

const helpers = require('./helpers');

function init(db, provider) {
    this.db = db;

    var schema = new provider.Schema({
        experimentSessionId: String,
        experimentId: String,
        experimentConfig: Object, 
        clientId: String,
        sessionStartTime: String,
        actions: Array,
    });

    this.model = provider.model('experimentSessions', schema);
}

function save(data, cb) {
    debug('save');

    function readCB(dbData){
        if (dbdata == null){
            dbdata = new this.model(data);
        }
        var savedata =  {};
        Object.assign(savedata, dbdata._doc, data);

        function saved(err, result){
            if (err) { debug(err); return  }
            if (cb != null && cb != undefined) {
                cb(result);
            }   
        }

        this.model.update(savedata).then(saved);
    }

    read.bind(this, data.experimentSessionId, readCB)();
}

function read(experimentSessionId, cb) {
    
    debug('read');
    this.model.findOne({ experimentSessionId: experimentSessionId }, function (err, data) {
        if (err) { debug(err); return; }
            cb(data);
        }
   );
}

module.exports = {
    read: read.bind(this),
    save: save.bind(this),
    init: init.bind(this)
};