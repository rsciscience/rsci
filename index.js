"use strict"
const ip = require('ip')
const debug = require('debug')('RSCI.index')
const db = require('./rsci/db')
const api = require('./rsci/api')
const discovery = require('./rsci/discovery')
const server = require('./rsci/server')
const client = require('./rsci/client')
const data_export = require('./rsci/export')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

debug('Init:RSCI')

console.log('')
console.log('  )    ')
console.log(' (__   ')
console.log(' _  )_ ')
console.log('(_)_(_)')
console.log(' (o o) ')
console.log('==\\o/==')
console.log('')


const state = require('./rsci/state')


async function initSettings(db) {
  debug('initSettings')

  const data = await db.settings.read()
  debug('Read settings')
  
  if (data && data.clientId) {
    state.clientId = data.clientId
  } else {
    state.clientId = 'id_' + ip.address()
    await db.settings.save({ clientId: state.clientId })
    debug('Saved settings')
  }
  if (data && data.isServer) {
    state.isServer = data.isServer
  }
  
  state.me = {
    ip: ip.address(),
    port: state.listeningPort,
    clientId: state.clientId,
    initTimeStamp: state.initTimeStamp,
  }
}

async function init() {
  debug('init')
  const _db = new db()
  await initSettings(_db)

  const _api = new api(state.listeningPort)
  const _request = new request(state.listeningPort)
  const _discovery = new discovery()
  const _client = new client(_db, _api, _request, _discovery)
  const _server = new server(_db, _discovery)
  const _export = new data_export(_db)
  state.experiments.configs = _server.experiments.load(state.experiments.configDir)
  _api.init(_client, _server, _export)

  if (state.isServer === true) {
    _server.register()
  } else {
    _client.search()
  }
}

init()
