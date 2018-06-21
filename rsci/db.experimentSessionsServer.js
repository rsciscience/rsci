const debug = require('debug')('RSCI.db.experimentSessionsServer');

const helpers = require('./helpers');

function init(db, provider) {
    this.db = db;

    var schema = new provider.Schema({
        experimentSessionId: String,
        experimentId: String,
        clients: Array,
        sessionStartTime: Date,
        sessionCompleted: Boolean,
        sessionCompletedTime: Date,
    });

    this.model = provider.model('experimentSessionsServer', schema);
    async function save(data) {
        debug('save');
        
        await model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            data,
            { upsert: true, 'new': true }
        );
        await model.findOneAndUpdate(
            { experimentSessionId: data.experimentSessionId },
            {$addToSet: {clients: {$each: data.clients}}}, 
            {upsert:true}
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
            {"experimentSessionId": experimentSessionId, "clients.clientId": clientId },
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