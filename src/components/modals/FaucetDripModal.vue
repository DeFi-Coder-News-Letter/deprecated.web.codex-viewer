<template>
  <b-modal
    title="Get CODX"
    id="faucetDripModal"
    ok-title="Request Tokens"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="requestDrip"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <p>
      To perform certain actions like creating new Records, a small fee in the form of CODX tokens is necessary. You may request free tokens to help facilitate testing by clicking the button below!
    </p>
  </b-modal>
</template>

<script>

import { mapState } from 'vuex'

import Faucet from '../../util/api/faucet'
import EventBus from '../../util/eventBus'

export default {

  data() {
    return {
      modalVisible: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
  },

  methods: {
    requestDrip(event) {

      event.preventDefault()

      return Faucet.requestDrip()
        .then(() => {
          EventBus.$emit('events:faucet-drip-request', this.user.address)
          EventBus.$emit('toast:success', 'CODX requested successfully! Your balance will update soon.', 5000)
          this.modalVisible = false
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not request CODX: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
