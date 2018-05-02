const debug = require('debug')('RSCI.db.experimentSessionsServer');

const helpers = require('./helpers');

function init(db, provider) {
    this.db = db;

    var schema = new provider.Schema({
        experimentSessionId: String,
        experimentId: String,
        clients: Object,
        sessionStartTime: String,
    });

    this.model = provider.model('experimentSessionsServer', schema);
    //no cb return promise
    async function save(data, cb) {
        debug('save');

        var cb_data = undefined;
        if(cb ){
            cb_data =  function (err, newData) {
                if (err) { debug('error Saving', err); return }
                if (cb){
                    cb(newData);
                }
            }
        }

        return model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            data,
            { upsert: true, 'new': true },
            cb_data
        );
    }

    async function read(experimentSessionId, cb) {
        debug('read');
        var cb_data = undefined;
        if(cb ){
            cb_data =  function (err, newData) {
                   if (err) { debug('error reading ', err); return }
                   if (cb){
                       cb(newData);
                   }
               }
           } 
       return model.findOne({ experimentSessionId: experimentSessionId }, cb_data);
    };

    async function getList(cb) {
        debug('getList');
        if(cb ){
            cb_data =  function (err, newData) {
                   if (err) { debug('error reading list ', err); return }
                   if (cb){
                       cb(newData);
                   }
               }
           } 
        return model.find({}, cb_data);
    };

    async function insertClientAction(experimentSessionId, clientId, clientAction) {
        debug('insertClientAction');
        console.log(experimentSessionId, clientId, clientAction);
        return model.update(
            {"experimentSessionId": experimentSessionId, "clients.clientId": clientId },
            {
                "$push":
                    {
                        "clients.$.clientAction": clientAction
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