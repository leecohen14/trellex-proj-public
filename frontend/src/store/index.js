import Vue from 'vue'
import Vuex from 'vuex'

import boardStore from "./modules/board.store.js"
import membersStore from "./modules/members.store.js"
import userStore from "./modules/user.store.js"

import userMsgStore from "./modules/user-msg.store.js"

import pwaStore from "./modules/pwa.store.js"

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        isBlack: false,
    },
    getters: {
        isBlack(state) {
            return state.isBlack
        },
    },
    mutations: {
        openBlack(state) {
            state.isBlack = true
        },
        closeBlack(state) {
            state.isBlack = false
        }
    },
    modules: {
        boardStore,
        membersStore,
        userStore,
        userMsgStore,

        pwaStore
    }
})
