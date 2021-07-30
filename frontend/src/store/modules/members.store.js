// members will hold the whole members of the current board
export default {
    strict: true,
    state: {
        members: null
    },
    getters: {
        members({ members }) {
            return JSON.parse(JSON.stringify(members))
        }
    },
    mutations: {
        setMembers(state, { members }) {
            state.members = members
        }
    },
}