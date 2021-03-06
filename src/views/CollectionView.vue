<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Collection">
          <template slot="buttons">
            <b-button
              variant="primary"
              v-b-modal.createAndModifyRecordModal
            >
              Add New Asset
            </b-button>
            <b-button
              variant="primary"
              v-b-modal.bulkRecordMintModal
              v-if="isNotSavvyUser && user.role === 'auction-house'"
            >
              Bulk Create Assets
            </b-button>
            <b-button
              variant="outline-primary"
              v-if="user && user.role === 'featured-collection' && myFeaturedCollection"
              :to="{ name: 'featured-collection', params: { shareCode: myFeaturedCollection.shareCode } }"
            >
              Go to My Featured Collection Page
            </b-button>
          </template>
          <template slot="actions" v-if="userRecords.length > 1">
            <RecordSearch
              type="user"
              v-if="userRecords.length >= paginationOptions.pageSize"
            />
            <b-form class="sorting-options">
              <b-form-select
                class="form-control"
                @input="sortingChanged"
                :options="sortingOptions"
                v-model="selectedSortingOption"
              />
            </b-form>
          </template>
        </AppHeader>
        <b-card-group deck class="record-list">
          <SavvySetupCard v-if="showSavvySetupCard" />

          <template v-if="giveaway">
            <ClaimGiveawayCard :giveaway="giveaway" />
            <GiveawayInfoCard :giveaway="giveaway" />
          </template>

          <!-- If there are no marketing cards displayed the user has no records, show a 'how-to' card -->
          <CreateRecordCard v-if="!giveaway && userRecords.length === 0" />

          <RecordListItem
            :key="record.tokenId"
            :codex-record="record"
            v-for="record in userRecords"
          />

        </b-card-group>

        <div class="pagination-controls" v-if="totalRecordCount > paginationOptions.pageSize">
          <b-button
            size="sm"
            @click="loadMore()"
            variant="outline-primary"
            :disabled="isLoading || userRecords.length >= totalRecordCount"
          >
            Load More
            <LoadingIcon v-show="isLoading" size="small" />
          </b-button>
        </div>

        <CreateAndModifyRecordModal mode="create" />
        <BulkRecordMintModal v-if="isNotSavvyUser && user.role === 'auction-house'" />

      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import config from '../util/config'

import AppHeader from '../components/core/AppHeader'

import SavvySetupCard from '../components/cards/SavvySetupCard'
import GiveawayInfoCard from '../components/cards/GiveawayInfoCard'
import CreateRecordCard from '../components/cards/CreateRecordCard'
import ClaimGiveawayCard from '../components/cards/ClaimGiveawayCard'

import RecordSearch from '../components/RecordSearch'
import LoadingIcon from '../components/util/LoadingIcon'
import RecordListItem from '../components/RecordListItem'
import BulkRecordMintModal from '../components/modals/BulkRecordMintModal'
import CreateAndModifyRecordModal from '../components/modals/CreateAndModifyRecordModal'

export default {

  components: {
    AppHeader,

    SavvySetupCard,
    GiveawayInfoCard,
    CreateRecordCard,
    ClaimGiveawayCard,

    LoadingIcon,
    RecordSearch,
    RecordListItem,

    BulkRecordMintModal,
    CreateAndModifyRecordModal,
  },

  data() {
    return {
      isLoading: false,
      selectedSortingOption: '-createdAt',
      sortingOptions: [
        { value: 'createdAt', text: 'Oldest First' },
        { value: '-createdAt', text: 'Newest First' },
        { value: 'metadata.name', text: 'Name (A-Z)' },
        { value: '-metadata.name', text: 'Name (Z-A)' },
      ],
    }
  },

  computed: {
    ...mapState('auth', ['user', 'hideSetup']),
    ...mapState('app', ['giveaway', 'featuredCollections']),
    ...mapState('records', ['totalRecordCount', 'paginationOptions']),
    ...mapState('records', {
      userRecords: (state) => {
        return state.lists.userRecords
      },
    }),
    ...mapGetters('auth', ['isNotSavvyUser']),

    myFeaturedCollection() {
      return this.featuredCollections.find((featuredCollection) => {
        return this.user.address === featuredCollection.userAddress
      })
    },

    showSavvySetupCard() {
      return config.feesEnabled && !this.isNotSavvyUser && !this.hideSetup && !this.giveaway
    },
  },

  methods: {
    loadMore() {
      this.isLoading = true
      return this.$store.dispatch('records/FETCH_NEXT_PAGE')
        .finally(() => {
          this.isLoading = false
        })
    },
    sortingChanged() {
      this.isLoading = true
      return this.$store.dispatch('records/REFRESH_USER_RECORDS', { order: this.selectedSortingOption })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.sorting-options
  @media (min-width: $breakpoint-sm)
    width: 10rem

.record-list
  display: flex
  flex-wrap: wrap

.pagination-controls
  display: flex
  margin: 2rem 0
  justify-content: center

</style>
