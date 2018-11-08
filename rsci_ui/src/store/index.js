// Make sure to call Vue.use(Vuex) first if using a module system
import Vuex from 'vuex'
import {HTTP} from '../http-common'

const initializeState = () => {
  return new Vuex.Store({
    state: {
      client: {
        me: { clientId: 'him' },
        server: {},
        experimentSessions: [],
        clientUIisAvailable: false,
        ts_ClientUIisAvailable: new Date()
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
      }
    },
    actions: {
      client_state_get (context) {
        function err (e) {
          console.log(e)
        }

        function success (context, data) {
          context.commit('updateClient', data)
        }

        HTTP.get('client/state').then(success.bind(this, context)).catch(err.bind(this))
      },
      client_post (context) {
        function err (e) {
          this.errors.push(e)
        }

        function success () {
          console.log('Updated!')
        }
        HTTP.post('client', {clientId: context.state.client.me.clientId}).then(success.bind(this, context)).catch(err.bind(this))
      }
    }
  })
}

export default { init: initializeState }
