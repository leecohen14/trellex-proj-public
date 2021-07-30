export default {
    strict: true,
    state: {
        msg: {
            txt: '',
            type: 'Success'
        },
        isShown: false,
        timeout: null,
        time: 3000
    },
    getters: {
        msg({ msg }) {
            return JSON.parse(JSON.stringify(msg))
        },
        msgShown({ isShown }) {
            return isShown
        }
    },
    mutations: {
        setMsgTxt(state, { txt }) {
            state.msg.txt = txt
        },
        setMsgType(state, { type }) {
            state.msg.type = type
        },
        setMsgTime(state, { time }) {
            state.time = time
        },
        openMsg(state) {
            state.isShown = true
        },
        closeMsg(state) {
            clearTimeout(state.timeout)
            state.timeout = null
            state.isShown = false
        },

        setTimeout(state, { timeout }) {
            state.timeout = timeout
        }
    },
    actions: {
        activeMsg({ state, commit }, { time }) {
            if (time) commit({ type: 'setMsgTime', time })
            clearTimeout(state.timeout)
            commit({ type: 'openMsg' })
            const timeout = setTimeout(() => {
                commit({ type: 'setMsgTime', time: 3000 })
                commit({ type: 'closeMsg' })
            }, state.time)

            commit({ type: 'setTimeout', timeout })
        }
    }
}