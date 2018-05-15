import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import store from './store/index'
import DateFilter from './filters/date'
import Alert from './components/Common/Alert'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import Vuetify from 'vuetify'

Vue.use(Vuetify, {theme: {
  primary: '#f44336',
  secondary: '#e57373',
  accent: '#9c27b0',
  error: '#f44336',
  warning: '#ffeb3b',
  info: '#2196f3',
  success: '#4caf50'
}})

Vue.filter('date', DateFilter)
Vue.component('app-alert', Alert)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAeRNKOUXnHOyVMS6qnLO3D1RgTrQn2qlM',
      authDomain: 'rum-meetup.firebaseapp.com',
      databaseURL: 'https://rum-meetup.firebaseio.com',
      projectId: 'rum-meetup',
      storageBucket: 'rum-meetup.appspot.com',
      messagingSenderId: '869803187885'
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignin', user)
      }
    })
    this.$store.dispatch('loadMeetups')
  }
})
