import debug from 'debug'
import Vue from 'vue'

const logger = debug('app:store:records:mutations')
const logMutation = (mutationName, ...args) => {
  logger(`${mutationName} mutation being executed`, ...args)
}

export default {
  SET_RECORDS(currentState, { listName, records }) {
    logMutation('SET_RECORDS', listName, records)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    currentState[listName] = records.filter((record) => {
      return !!record.metadata
    }) || []
  },

  ADD_RECORD_TO_LIST(currentState, { listName, record }) {
    logMutation('ADD_RECORD_TO_LIST', listName, record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    const exists = currentState[listName].find((existingRecord) => {
      return existingRecord.tokenId === record.tokenId
    })

    if (!exists) {
      currentState[listName].push(record)
    }
  },

  REMOVE_RECORD_FROM_LIST(currentState, { listName, record }) {
    logMutation('REMOVE_RECORD_FROM_LIST', listName, record)

    currentState[listName] = currentState[listName].filter((codexRecord) => {
      return codexRecord.tokenId !== record.tokenId
    })
  },

  SET_ACTIVE_RECORD(currentState, record) {
    logMutation('SET_ACTIVE_RECORD_INDEX', record)

    currentState.activeRecord = record
  },

  UPDATE_RECORD_IN_LISTS(currentState, record) {
    logMutation('UPDATE_RECORD_IN_LISTS', record)

    // Filter out any records that don't have metadata attached to them.
    //  These are records that were created by other providers.
    if (!record.metadata) {
      return
    }

    const listNames = [
      'userRecords',
      'incomingTransfers',
      'outgoingTransfers',
    ]

    // Update the record in each list that we've cached
    listNames.forEach((listName) => {
      let index = -1
      for (let i = 0; i < currentState[listName].length; i++) {
        if (currentState[listName][i].tokenId === record.tokenId) {
          index = i
          break
        }
      }

      if (index > -1) {
        Vue.set(currentState[listName], index, record)
      }
    })

    // Also update the active record if it's what the user is currently looking at
    if (currentState.activeRecord && currentState.activeRecord.tokenId === record.tokenId) {
      currentState.activeRecord = record
    }
  },
}
