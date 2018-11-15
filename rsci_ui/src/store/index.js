// Make sure to call Vue.use(Vuex) first if using a module system
import Vuex from 'vuex'
import {HTTP} from '../http-common'
// import { localeData } from 'moment';

const err = (e) => {
  console.log(e)
}

const initializeState = () => {
  return new Vuex.Store({
    state: {
      client: {
        me: { clientId: 'him' },
        server: {},
        experimentSessions: [],
        clientUIisAvailable: false,
        ts_ClientUIisAvailable: new Date()
      },
      admin: {
        me: '',
        server: {},
        discoveryList: [],
        clientList: [],
        experimentSessions: [],
        experimentSessionCurrent: {
          running: false,
          experimentSessionId: '',
          clients: []
        },
        experiments: [],
        initialConfig: []
      }
    },
    mutations: {
      updateClient (state, data) {
        console.log(data)
        state.client.me = data.data.me
        state.client.server = data.data.server
        state.client.experimentSessions = data.data.experimentSessionsLocal
        state.client.clientUIisAvailable = data.data.clientUIisAvailable
        state.client.ts_ClientUIisAvailable = data.data.ts_ClientUIisAvailable
      },
      updateAdmin (state, data) {
        state.admin.me = data.data.me
        state.admin.server = data.data.server
        state.admin.discoveryList = data.data.discoveryList
        state.admin.clientList = data.data.clientList
      },
      updateAdmin_experiments (state, data) {
        state.admin.experiments = data.data
      },
      updateAdmin_experiments_session (state, data) {
        state.admin.experimentSessions = data.data
      },
      updateAdmin_server_experiment (state, data) {
        state.admin.initialConfig = data.data
      }
    },
    actions: {
      // Admin
      server_experiments_session_get (context) {
        function successExperimentsSessionsList (context, data) {
          context.commit('updateAdmin_experiments_session', data)
        }
        HTTP.get('server/experiments/sessions').then(successExperimentsSessionsList.bind(this, context)).catch(err.bind(this))
      },
      server_experiment_list_get (context) {
        function successExperimentsList (context, data) {
          context.commit('updateAdmin_experiments', data)
        }

        HTTP.get('server/experiments/list').then(successExperimentsList.bind(this, context)).catch(err.bind(this))
      },
      server_network_get (context) {
        function success (context, data) {
          context.commit('updateAdmin', data)
        }

        HTTP.get('server/network').then(success.bind(this, context)).catch(err.bind(this))
      },
      server_register_post (context) {
        function success (response) {
          console.log('Called Server Register!')
        }

        HTTP.post('server/register', {}).then(success.bind(this, context)).catch(err.bind(this))
      },
      server_experiments_reload_post (context) {
        function success (context) {
          console.log('Called server/experiments/reload')
        }
        HTTP.post('server/experiments/reload', {}).then(success.bind(this, context)).catch(err.bind(this))
      },
      server_network_rescan_post (context) {
        function success (context, data) {
          console.log('Called Server Network Rescan!')
        }
        HTTP.post('server/network/rescan', {}).then(success.bind(this, context)).catch(err.bind(this))
      },
      server_experiment (context, id) {
        function success (context, data) {
          console.log('Got Experiment Initial Config!')
          context.commit('updateAdmin_server_experiment', data)
        }
        HTTP.get('server/experiment/' + id + '/initialConfig').then(success.bind(this, context)).catch(err.bind(this))
      },
      // Client
      client_state_get (context) {
        function success (context, data) {
          context.commit('updateClient', data)
        }

        HTTP.get('client/state').then(success.bind(this, context)).catch(err.bind(this))
      },
      client_post (context) {
        function success () {
          console.log('Updated!')
        }
        HTTP.post('client', {clientId: context.state.client.me.clientId}).then(success.bind(this, context)).catch(err.bind(this))
      }
    }
  })
}

export default { init: initializeState }
