import * as fb from '../../services/firebase'
import router from '../../router/index'

export default {
    state: {
      userProfile: {},
      posts: []
    },
    mutations: {
      setUserProfile(state, val) {
        state.userProfile = val
      }
    },
    actions: {
      async login({ dispatch }, form) {
        // sign user in
        const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
    
        // fetch user profile and set in state
        dispatch('fetchUserProfile', user)
      },
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
    
      // create user profile object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
      })
    
      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      if (router.currentRoute.path === '/register') {
        router.push('/login')
      }
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    }
  }
}