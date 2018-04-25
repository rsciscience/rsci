const debug = require('debug')('RSCI.db');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const db = mongoose.connect('mongodb://127.0.0.1/rsci');

var Schema = mongoose.Schema;

this.settings = require('./db.settings')(db, mongoose);;
this.experimentSessionsLocal = require('./db.experimentSessionsLocal')(db,mongoose);
this.experimentSessionsServer = require('./db.experimentSessionsServer')(db,mongoose);

module.exports = this;