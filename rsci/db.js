const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/rsci');

this.settings = require('./db.settings')(mongoose);
this.experimentSessionsLocal = require('./db.experimentSessionsLocal')(mongoose);
this.experimentSessionsServer = require('./db.experimentSessionsServer')(mongoose);

module.exports = this;