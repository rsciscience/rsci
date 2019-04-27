"use strict"
var path = require('path');
const debug = require('debug')('RSCI.UI');
const express = require('express');

class UI {
    constructor(expressApp) {
        debug("Init")
        const ui_path  = path.join(__dirname , "/.." ,"/rsci_ui/dist")
        const ui_src_path  = path.join(__dirname , "/.." ,"/rsci_ui/src/assets")
        debug("Serving UI from path: " +  ui_path )
        expressApp.use(express.static(ui_path))
        expressApp.use('/src/assets' , express.static(ui_src_path))
    }
}

module.exports = UI










