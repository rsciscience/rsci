const debug = require('debug')('RSCI.db');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const db = mongoose.connect('mongodb://127.0.0.1/rsci');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var settings_schema = new Schema({
    clientId : String,
    isServer: Boolean
});

var experimentSessions_schema = new Schema({
    experimentSessionId: String,
    experimentId: String,
    experimentConfig: Object, 
    clientId: String,
    sessionStartTime: String,
    actions: Array,
});

var m_settings = mongoose.model('settings', settings_schema);
var m_experimentSessions = mongoose.model('experimentSessions', experimentSessions_schema);

function settingsSave(data,cb) {
    debug('settingsSave');

    function readCB(settings){
        if (settings == null){
            settings = new m_settings(data);
        }
        var savedata =  {};
        Object.assign(savedata, settings._doc, data);

        function saved(err,data){
            if (err) { debug(err); return  }
            cb(data);
        }

        m_settings.update(savedata).then(saved);
    }
    settingsRead(readCB);
}

function settingsRead(cb) {
    debug('settingsRead');
    m_settings.findOne({}, function (err, data) {
        if (err) { debug(err); return; }
            cb(data);
        }
   );
}

function experimentSessionLocalCreate (data) {
    return new m_settings(data);

}

function experimentSessionLocalSave (data, cb) {

    function saved(err, savedData){
        if (err) { debug(err); return  }
        cb(savedData);
    }

    data.update().then(saved);
   
}

module.exports = {
    experimentSessions: {
        read: experimentSessionsRead,
        save: experimentSessionLocalSave
    },
    settings:{
        read: settingsRead,
        save: settingsSave
    }
};