import store from '../store'

/* eslint-disable */
export default (to, from, next) => {
  if (store.getters.user) {
    next()
  } else {
    next('/signin')
  }
}