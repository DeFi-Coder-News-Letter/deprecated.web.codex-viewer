import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import config from '../util/config'

import LoginView from '../views/LoginView'
import GetCODXView from '../views/GetCODXView'
import SettingsView from '../views/SettingsView'
import ContactUsView from '../views/ContactUsView'
import CollectionView from '../views/CollectionView'
import FeatureListView from '../views/FeatureListView'
import ManageTokensView from '../views/ManageTokensView'
import RecordDetailView from '../views/RecordDetailView'
import TransferListView from '../views/TransferListView'
import ConfirmEmailView from '../views/ConfirmEmailView'
import ResetPasswordView from '../views/ResetPasswordView'
import PublicCollectionView from '../views/PublicCollectionView'
import AuctionHouseListView from '../views/AuctionHouseListView'
import FeaturedCollectionListView from '../views/FeaturedCollectionListView'

Vue.use(Router)

const router = new Router({
  routes: [

    // login routes
    {
      name: 'login',
      path: '/',
      alias: [
        '/login',
        '/signup',
      ],
      component: LoginView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'confirm-email',
      path: '/confirm-email',
      component: ConfirmEmailView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'reset-password',
      path: '/reset-password',
      component: ResetPasswordView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        ifAuthenticatedRedirect: true,
        allowUnauthenticatedUsers: true,
      },
    },

    // main application routes
    {
      name: 'settings',
      path: '/settings',
      component: SettingsView,
    },
    {
      name: 'collection',
      path: '/collection',
      component: CollectionView,
    },
    {
      name: 'contact',
      path: '/contact',
      component: ContactUsView,
      meta: {
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'record-detail',
      path: '/record/:recordId',
      component: RecordDetailView,
      meta: {
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'transfers',
      path: '/transfers',
      redirect: '/transfers/incoming',
    },
    {
      name: 'incoming-transfers',
      path: '/transfers/incoming',
      component: TransferListView,
      props: {
        transferDirection: 'incoming',
      },
    },
    {
      name: 'outgoing-transfers',
      path: '/transfers/outgoing',
      component: TransferListView,
      props: {
        transferDirection: 'outgoing',
      },
    },
    {
      name: 'get-codx',
      path: '/get-codx',
      component: GetCODXView,
    },

    // auction house routes
    {
      name: 'auction-houses',
      path: '/auction-houses',
      component: AuctionHouseListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'auction-house',
      component: PublicCollectionView,
      path: '/auction-houses/:shareCode',
      meta: { allowUnauthenticatedUsers: true },
    },

    // featured collection routes
    {
      name: 'featured-collections',
      path: '/featured-collections',
      component: FeaturedCollectionListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'featured-collection',
      component: PublicCollectionView,
      path: '/featured-collections/:shareCode',
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'galleries',
      path: '/galleries',
      redirect: '/featured-collections',
    },
    {
      name: 'gallery',
      path: '/galleries/:shareCode',
      redirect: '/featured-collections/:shareCode',
    },

    // other non-application routes
    {
      name: 'extensions',
      path: '/extensions',
      component: FeatureListView,
    },
  ],
})

if (config.showManageTokensPage) {
  router.addRoutes([
    { name: 'manage-tokens', path: '/manage-tokens', component: ManageTokensView },
  ])
}

router.beforeEach((to, from, next) => {

  if (to.meta.ifAuthenticatedRedirect && store.getters['auth/isAuthenticated']) {
    return next({ name: 'collection' })
  }

  const requireAuthentication = to.matched.some((route) => {
    return !route.meta.allowUnauthenticatedUsers
  })

  // if no route was matched (i.e. a 404)
  // or if the user is trying to access an authenticated page but is unauthenticated
  // then send them to the login page
  if (to.matched.length === 0 || (requireAuthentication && !store.getters['auth/isAuthenticated'])) {
    const nextRoute = { name: 'login' }

    // If a route was matched but the request is unauthenticated, then cache the original destination for post-authentication
    if (to.matched.length > 0) {
      nextRoute.query = { destination: to.fullPath }
    }

    return next(nextRoute)
  }

  return next()

})

// on mobile devices, if the user navigates from a page with the sidebar to a
//  page without the sidebar (e.g. public-collections > login), the blur effect
//  would still be visible because "showNav" in the app state store would still
//  be true because the sidebar component is destroyed before the TOGGLE_NAV
//  call is made... so let's just always toggle showNav off when transitioning
//  to a route without the sidenav
router.afterEach((to, from) => {
  if (to.meta.hideSideBar) {
    store.dispatch('app/TOGGLE_NAV', false)
  }
})

export default router
