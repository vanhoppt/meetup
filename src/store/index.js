import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'http://marriottdanang.vn/wp-content/uploads/2017/08/marriott-da-nang-2.jpg',
        id: '1',
        title: 'Meetup in Da Nang',
        date: new Date(),
        location: 'Da Nang',
        description: `It's Da Nang`
      },
      {
        imageUrl: 'http://www.pullmanhotels.com/imagerie/destinations/city/ho-chi-minh-1400x788-1.jpg',
        id: '2',
        title: 'Meetup in Sai Gon',
        date: new Date(),
        location: 'Sai Gon',
        description: `It's Sai Gon`
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then(
          response => {
            const meetups = []  // eslint-disable-line
            const obj = response.val()  // eslint-disable-line
            for (let key in obj) {
              meetups.push({
                id: key,
                title: obj[key].title,
                description: obj[key].description,
                imageUrl: obj[key].imageUrl,
                location: obj[key].location,
                date: obj[key].date
              })
            }
            commit('setLoadedMeetups', meetups)
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            console.log(error)
            commit('setLoading', true)
          }
        )
    },
    createMeetup ({commit}, payload) {
      // eslint-disable-next-line
      const meetup = {  
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString()
      }
      firebase.database().ref('meetups').push(meetup)
        .then((response) => {
          const key = response.key  // eslint-disable-line
          commit('createMeetup', {
            ...meetup,
            id: key
          })
        }
        )
        .catch(error => console.log(error))
      commit('createMeetup', meetup)
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          // eslint-disable-next-line
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          }
          commit('setUser', newUser)
        })
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loadedMeetups: (state) => state.loadedMeetups.sort((meetupA, meetupB) => meetupA.date > meetupB.date),
    featureMeetups: (state, getters) => getters.loadedMeetups.slice(0, 5),
    loadedMeetup: state => meetupId => state.loadedMeetups.find((meetup) => meetup.id === meetupId),
    user: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error
  }
})
