import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import Networks from '../util/constants/networks'

import registerWeb3 from '../util/web3/registerWeb3'
import pollWeb3 from '../util/web3/pollWeb3'
import getContract from '../util/web3/getContract'

Vue.use(Vuex)
const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance(currentState, payload) {
      console.log('registerWeb3instance mutation being executed', payload)

      const result = payload
      const web3Copy = state.web3

      web3Copy.account = result.account
      web3Copy.network = Networks[result.networkId]
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.instance = result.web3
      currentState.web3 = web3Copy

      pollWeb3()
    },
    pollWeb3Instance(currentState, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)

      currentState.web3.account = payload.account
      currentState.web3.balance = payload.balance
    },
    getContractInstance(currentState, payload) {
      console.log('registerContractInstance mutation being executed', payload)

      currentState.contractInstance = () => payload
    },
    setMockData(currentState, useMockData) {
      console.log('setMockData mutation being executed', useMockData)

      currentState.useMockData = useMockData
    },
    setAuthToken(currentState, authToken) {
      console.log('setAuthToken mutation being executed', authToken)

      currentState.authToken = authToken
    },
  },
  actions: {
    registerWeb3({ commit }) {
      registerWeb3.then((result) => {
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch((e) => {
        console.log('error in action registerWeb3', e)
      })
    },
    pollWeb3({ commit }, payload) {
      console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
    getContract({ commit }) {
      getContract.then((result) => {
        commit('getContractInstance', result)
      }).catch((e) => {
        console.log('error in action getContractInstance', e)
      })
    },
    toggleMockData(context) {
      context.commit('setMockData', !context.state.useMockData)
    },
  },
})

export default store
