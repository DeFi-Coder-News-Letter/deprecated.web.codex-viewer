import debug from 'debug'

const logger = debug('app:store:app:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_VERIFIED_USERS(currentState, users) {

    logMutation('SET_VERIFIED_USERS', users)

    const newAddressNameMap = {}

    users.forEach((user) => {
      if (!user.name || !user.address) return
      newAddressNameMap[user.address.toLowerCase()] = user.name
    })

    currentState.verifiedUsers = newAddressNameMap

  },

  SET_PENDING_USER_CODE(currentState, pendingUserCode) {
    logMutation('SET_PENDING_USER_CODE', pendingUserCode)
    currentState.pendingUserCode = pendingUserCode
  },

  SET_PASSWORD_RESET_CODE(currentState, passwordResetCode) {
    logMutation('SET_PASSWORD_RESET_CODE', passwordResetCode)
    currentState.passwordResetCode = passwordResetCode
  },

  SET_PASSWORD_RESET_EMAIL(currentState, passwordResetEmail) {
    logMutation('SET_PASSWORD_RESET_EMAIL', passwordResetEmail)
    currentState.passwordResetEmail = passwordResetEmail
  },

  SET_EMAIL_ADDRESS_TO_CONFIRM(currentState, emailAddress) {
    logMutation('SET_EMAIL_ADDRESS_TO_CONFIRM', emailAddress)
    currentState.emailAddressToConfirm = emailAddress
  },

  SET_API_ERROR_CODE(currentState, code) {
    logMutation('SET_API_ERROR_CODE', code)
    currentState.apiErrorCode = code
  },

  SET_API_ERROR_MESSAGE(currentState, message) {
    logMutation('SET_API_ERROR_MESSAGE', message)
    currentState.apiErrorMessage = message
  },

  SET_IS_LOADED(currentState, isLoaded) {
    logMutation('SET_IS_LOADED', isLoaded)
    currentState.isLoaded = isLoaded
  },

  SET_SHOW_NAV(currentState, showNav) {
    logMutation('SET_SHOW_NAV', showNav)
    currentState.showNav = showNav
  },

  SET_POST_LOGIN_DESTINATION(currentState, destination) {
    logMutation('SET_POST_LOGIN_DESTINATION', destination)
    currentState.postLoginDestination = destination
  },

  SET_GIVEAWAY(currentState, giveaway) {
    logMutation('SET_GIVEAWAY', giveaway)
    currentState.giveaway = giveaway
  },

  SET_PUBLIC_COLLECTIONS(currentState, publicCollections = []) {
    logMutation('SET_PUBLIC_COLLECTIONS', publicCollections)

    const auctionHouses = []
    const featuredCollections = []

    publicCollections.forEach((publicCollection) => {
      switch (publicCollection.type) {
        case 'auction-house': return auctionHouses.push(publicCollection)
        case 'featured-collection': return featuredCollections.push(publicCollection)
        default: return null
      }
    })

    currentState.auctionHouses = auctionHouses
    currentState.publicCollections = publicCollections
    currentState.featuredCollections = featuredCollections

  },

  SET_EVENT_EMAILS(currentState, eventEmails = []) {
    logMutation('SET_EVENT_EMAILS', eventEmails)
    currentState.eventEmails = eventEmails
  },

  SET_REFERRAL_SURVEY_OPTIONS(currentState, referralSurveyOptions = []) {
    logMutation('SET_REFERRAL_SURVEY_OPTIONS', referralSurveyOptions)
    currentState.referralSurveyOptions = referralSurveyOptions
  },

  SET_CODX_COSTS(currentState, codxCosts = {}) {
    logMutation('SET_CODX_COSTS', codxCosts)
    currentState.codxCosts = codxCosts
  },

  SET_CODX_PACKAGES(currentState, codxPackages = {}) {
    logMutation('SET_CODX_PACKAGES', codxPackages)
    currentState.codxPackages = codxPackages
  },

  ADD_GLOBAL_REF(currentState, { name, $ref }) {
    logMutation('ADD_GLOBAL_REF', { name, $ref })
    currentState.$globalRefs[name] = $ref
  },
}
