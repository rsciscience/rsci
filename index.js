"use strict"
const ip = require('ip')
const debug = require('debug')('RSCI.index')
const server = require('./rsci/server')
const client = require('./rsci/client')
const api = require('./rsci/api')

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


const db = require('./rsci/db')
const exp = require('./rsci/export')
const state = require('./rsci/state')


async function initSettings() {
  debug('initSettings')

  var data = await db.settings.read()
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
    me: true,
    ip: ip.address(),
    port: state.listeningPort,
    clientId: state.clientId,
    initTimeStamp: state.initTimeStamp,
  }
}

async function init() {
  debug('init')
  await initSettings()

  const _api = new api()
  const cl = new client(_api)
  const srv = new server()
  state.experiments.configs = srv.experiments.load(state.experiments.configDir)
  _api.init(state.listeningPort, cl, srv, exp)

  if (state.isServer === true) {
    srv.register()
  } else {
    cl.search()
  }
}

init()
