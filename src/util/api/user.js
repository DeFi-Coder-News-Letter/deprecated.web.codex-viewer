import callApi from './callApi'

export default {
  getUser: () => {
    const requestOptions = {
      method: 'get',
      url: '/user',
    }

    return callApi(requestOptions)
  },

  getAuthTokenFromSignedData: (data) => {
    const requestOptions = {
      method: 'post',
      url: '/auth-token',
      data,
    }

    return callApi(requestOptions)
  },
}
