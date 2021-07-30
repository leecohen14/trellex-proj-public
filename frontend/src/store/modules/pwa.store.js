import { boardService } from "../../services/board.service.js"


export default {
    strict: true,
    state: {
        actionsToCommit: JSON.parse(localStorage.getItem('actionsToCommit')) || [],

        interval: null
    },
    mutations: {
        pushAction(state, { action }) {
            state.actionsToCommit.push(action)

            localStorage.setItem('actionsToCommit', JSON.stringify(state.actionsToCommit))
        },
        zeroActions(state, { }) {
            state.actionsToCommit = []

            localStorage.setItem('actionsToCommit', JSON.stringify(state.actionsToCommit))
        },
        setInter(state, { inter }) {
            state.interval = inter

            localStorage.setItem('actionsToCommit', JSON.stringify(state.actionsToCommit))
        },
        // parseFunc(state, { idx }) {
        //     state.actionsToCommit[idx].func = eval('(' + state.actionsToCommit[idx].func + ')')
        // }
    },
    getters: {
        actionsToCommit(state) {
            return JSON.parse(JSON.stringify(state.actionsToCommit))
        }
    },
    actions: {
        async commitActions({ state, commit, dispatch }) {
            console.log('trying to sync...')
            if (!state.actionsToCommit?.length) return
            // await state.actionsToCommit.forEach(async (commitToExec, idx) => {
            //     await boardService[commitToExec.func](...commitToExec.params)

            //     // commit({ type: 'parseFunc', idx })
            //     // await commitToExec.func(...commitToExec.params)
            // })

            try {
                // NOT GOOD - will preform all actions not in that order
                // await Promise.all(state.actionsToCommit.map(async (commitToExec) => {
                //     await boardService[commitToExec.func](...commitToExec.params)
                //     dispatch({ type: 'activeMsg', time: 1000 })
                // }))

                commit({ type: 'setMsgTxt', txt: 'Trying to Sync...' })
                dispatch({ type: 'activeMsg', time: 2200 })
                for (const commitToExec of state.actionsToCommit) {
                    await boardService[commitToExec.func](...commitToExec.params)
                }

                commit({ type: 'zeroActions' })

                commit({ type: 'setMsgTxt', txt: 'Done Syncing!' })
                dispatch({ type: 'activeMsg', time: 6000 })

            } catch (error) {
                dispatch({ type: 'activeMsg', time: 0 })
                console.log('Not able to sync')
            }
        },
        async pushAction({ state, commit, dispatch }, payload) {
            clearInterval(state.interval)
            commit(payload)
            const inter = setInterval(async () => {
                if (!state.actionsToCommit?.length) {
                    clearInterval(state.inter)
                    return
                }
                await dispatch({ type: 'commitActions' })
            }, 3500)

            commit({ type: 'setInter', inter })
        }
    },
}