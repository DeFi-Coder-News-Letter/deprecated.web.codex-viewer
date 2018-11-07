import axios from 'axios'
import debug from 'debug'

import router from '../../../router'

const logger = debug('app:store:app:actions')

const queryParamsToHandle = {
  email: {
    mutationName: 'SET_EMAIL_ADDRESS_TO_CONFIRM',
    clearUserState: true,
  },
  pendingUserCode: {
    mutationName: 'SET_PENDING_USER_CODE',
    clearUserState: true,
  },
  destination: {
    mutationName: 'SET_POST_LOGIN_DESTINATION',
  },

  // If there's a cached authToken in localstorage this will replace it with
  //  the one from the query string
  authToken: {
    mutationName: 'auth/SET_AUTH_STATE',
    mutationConfiguration: { root: true },
  },

  // API error handling
  errorCode: {
    mutationName: 'SET_API_ERROR_CODE',
  },
  error: {
    mutationName: 'SET_API_ERROR_MESSAGE',
  },
}

export default {
  HANDLE_QUERY_PARAMS({ commit, rootState }) {
    logger('HANDLE_QUERY_PARAMS action being executed')

    const { query } = rootState.route

    Object.keys(queryParamsToHandle).forEach((key) => {
      if (query[key]) {
        const param = queryParamsToHandle[key]

        commit(param.mutationName, query[key], param.mutationConfiguration)

        if (param.clearUserState) {
          commit('auth/CLEAR_USER_STATE', null, { root: true })
        }
      }
    })

    router.replace(rootState.route.path)
  },

  FETCH_VERIFIED_USERS({ commit }) {
    logger('FETCH_VERIFIED_USERS action being executed')

    const requestOptions = {
      url: '/verified-users',
      method: 'get',
    }

    return axios(requestOptions)
      .then((response) => {
        commit('SET_VERIFIED_USERS', response.data.result)
      })
      .catch((error) => {
        logger('Error retrieving the Verified Users address map, ignoring.', error)
      })
  },
}
