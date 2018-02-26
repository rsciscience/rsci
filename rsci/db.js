const debug = require('debug')('RSCI.db.');
const mongoose = require('mongoose');
const helpers = require('./helpers');
mongoose.connect('mongodb://127.0.0.1/rsci');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var settings_schema = new Schema({
    clientId : String
});

var experimentSessions_schema = new Schema({
});

var m_settings = mongoose.model('settings', settings_schema);
var m_experimentSessions = mongoose.model('experimentSessions', experimentSessions_schema);

function settingsSave(data,cb) {
    debug('settingsSave');
    function readCB(settings){
        console.log(settings)
        if (settings == null){
            settings = new m_settings(data);
        }
        console.log(data);
        console.log(settings)
        settings.save(data).then(cb);
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

function experimentSessionsSave (cb){
}

function experimentSessionsRead (){
    m_experimentSessions.find( function (err, data) {
        if (err) { debug(); return; }
        if (data != null) {
            cb(data);
        }
    })
}


module.exports = {
    experimentSessions: {
        read: experimentSessionsRead,
        save: experimentSessionsSave
    },
    settings:{
        read: settingsRead,
        save: settingsSave
    }
};