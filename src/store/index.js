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
    updateMeetupData (state, payload) {
      let meetup = state.loadedMeetups.find(meetup => meetup.id === payload.id)
      if (payload.title) meetup.title = payload.title
      if (payload.description) meetup.description = payload.description
      if (payload.date) meetup.date = payload.date
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
                date: obj[key].date,
                creatorId: obj[key].creatorId
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
    createMeetup ({commit, getters}, payload) {
      // eslint-disable-next-line
      const meetup = {  
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
        .then((response) => {
          key = response.key  // eslint-disable-line
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          let ref = firebase.storage().ref().child('meetups')
          let file = `${key}.${ext}`
          return ref.child(file).put(payload.image)
        })
        .then(snapshot => {
          let filename = snapshot.metadata.name
          let ref = firebase.storage().ref().child('meetups')
          return ref.child(filename).getDownloadURL()
        })
        .then(fileURL => {
          imageUrl = fileURL
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch(error => console.log(error))
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetupData', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
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
    autoSignin ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: []})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
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
