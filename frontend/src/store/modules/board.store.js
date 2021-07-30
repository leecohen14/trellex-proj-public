import { boardService } from "../../services/board.service.js"
import { utilService } from "../../services/util.service.js"
import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_BOARD_UPDATED, SOCKET_EVENT_USER_UPDATED } from "../../services/socket.service.js"
import Vue from 'vue'
import eventBusService from '../../services/event-bus.service.js';
export default {
    strict: true,
    state: {
        board: null,
        currTask: null,
        isTaskQuickEdit: null,
        isLabelsOpen: -1,
        groupIdByTaskId: null,
    },
    getters: {
        board(state) {
            return JSON.parse(JSON.stringify(state.board))
        },
        currTask(state) {
            if (!state.currTask) return null
            return JSON.parse(JSON.stringify(state.currTask))
        },
        isTaskQuickEdit(state) {
            return state.isTaskQuickEdit
        },
        labels(state) {
            return JSON.parse(JSON.stringify(state.board.labels))
        },
        isLabelsOpen(state) {
            return state.isLabelsOpen
        },
        groupIdByTaskId(state) {
            return state.groupIdByTaskId
        },
    },
    mutations: {
        // --------------- Board ---------------
        setBoard(state, { board }) {
            state.board = board
        },
        saveBoardTitle(state, { boardTitle }) {
            state.board.title = boardTitle
        },

        setBoardStyle(state, { boardStyle }) {
            state.board.style = boardStyle
        },
        toggleBoardIsFavorite(state, { isFav }) {
            state.board.isFavorite = isFav
        },

        // --------------- TASK ---------------
        getTaskById(state, { groupId, taskId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            state.currTask = task
        },
        addTask(state, { groupId, taskToSave }) {
            console.log('GROUP ID >>>');
            console.log('TASK TO SAVE >>>');
            taskToSave.id = utilService.makeId()
            const group = state.board.groups.find(g => g.id === groupId)
            group.tasks.push(taskToSave)
        },
        saveTask(state, { groupId, taskToSave }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const taskIdx = group.tasks.findIndex(t => t.id === taskToSave.id)
            if (taskIdx < 0) return
            group.tasks.splice(taskIdx, 1, taskToSave)

        },
        removeTask(state, { groupId, taskId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const taskIdx = group.tasks.findIndex(t => t.id === taskId)
            if (taskIdx < 0) return

            group.tasks.splice(taskIdx, 1)
        },
        setTasks(state, { groupId, tasksToSave }) {
            const groupIdx = state.board.groups.findIndex(g => g.id === groupId)
            if (groupIdx < 0) return

            state.board.groups[groupIdx].tasks = tasksToSave
        },
        setTaskQuickEdit(state, { id }) {
            state.isTaskQuickEdit = id
        },
        closeQuickEdit(state) {
            state.isTaskQuickEdit = null
        },

        //  ------------- Group ---------------
        // addGroup(state, { newGroup }) {
        //     state.board.groups.push(newGroup)
        // },
        addGroup(state, { groupToSave }) {
            state.board.groups ??= []
            const idx = state.board.groups.findIndex(g => g.id === groupToSave.id)
            if (idx < 0) {
                groupToSave.id = utilService.makeId()
                state.board.groups.push(groupToSave)
                return
            }
            state.board.groups.splice(idx, 1, groupToSave)
        },
        removeGroup(state, { groupId }) {
            const groupIdx = state.board.groups.findIndex(g => g.id === groupId)
            if (groupIdx < 0) return
            state.board.groups.splice(groupIdx, 1)
        },
        setGroups(state, { groups }) {
            state.board.groups = groups
        },
        // !un-recommended
        getGroupIdByTaskId(state, { taskId }) {
            const groups = state.board.groups
            groups.forEach(g => {
                const task = g.tasks?.find(t => t.id === taskId)
                if (task) {
                    state.groupIdByTaskId = g.id
                    return
                }
            })
        },

        // --------------- Labels ---------------
        addLabelToTask(state, { labelId, taskId, groupId }) {
            const groupIdx = state.board.groups.findIndex(g => g.id === groupId)
            const taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === taskId)
            const task = state.board.groups[groupIdx].tasks[taskIdx]
            if (!task.labelIds) Vue.set(task, 'labelIds', [])
            task.labelIds.push(labelId)
            state.currTask = JSON.parse(JSON.stringify(task))
        },
        saveLabels(state, { labels }) {
            state.board.labels = labels
        },
        removeLabelFromTask(state, { labelId, taskId, groupId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            const idx = task.labelIds.findIndex(lId => lId === labelId)
            task.labelIds.splice(idx, 1)
            state.currTask = JSON.parse(JSON.stringify(task))
        },
        toggleLabelsIsOpen(state, { position }) {
            state.isLabelsOpen = position
        },

        // --------------- Members ---------------
        joinMemberToTask(state, { member, taskId, groupId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            if (!task.members) Vue.set(task, 'members', [])
            task.members.push(member)
            socketService.emit('user-watch-task', ({ userId: member._id, taskId, taskTitle: task.title }))
            state.currTask = JSON.parse(JSON.stringify(task))
            return task
        },
        removeMemberFromTask(state, { member, taskId, groupId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            const idx = task.members.findIndex(m => m._id === member._id)
            task.members.splice(idx, 1)
            state.currTask = JSON.parse(JSON.stringify(task))
        },

        // --------------- Cover ---------------
        changeTaskCover(state, { taskId, groupId, cover }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            if (!task.cover) Vue.set(task, 'cover', {})
            task.cover = cover
            state.currTask = JSON.parse(JSON.stringify(task))
        },

        // --------------- Attachments ---------------
        addAttachments(state, { attachments, taskId, groupId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            if (!task.attachments) Vue.set(task, 'attachments', [])
            task.attachments = task.attachments.concat(attachments)
            state.currTask = JSON.parse(JSON.stringify(task))
        },
        removeFile(state, { fileId, taskId, groupId }) {
            const group = state.board.groups.find(g => g.id === groupId)
            const task = group.tasks.find(t => t.id === taskId)
            const idx = task.attachments.findIndex(f => f.id === fileId)
            if (task.cover?.bgUrl === task.attachments[idx].fileUrl) task.cover = { isFull: false }
            task.attachments.splice(idx, 1)
            state.currTask = JSON.parse(JSON.stringify(task))
        },

        // --------------- Activities ---------------
        pushTaskActivity(state, { task, activity, taskId, groupId }) {
            if (!task) {
                const group = state.board.groups.find(g => g.id === groupId)
                task = group.tasks.find(t => t.id === taskId)
            }
            if (!task.activities) Vue.set(task, 'activities', [])
            task.activities.push(activity)
        },
        pushBoardActivity(state, { activity }) {
            if (!state.board.activities) Vue.set(state.board, 'activities', [])
            state.board.activities.unshift(activity)
        },
        // --------------- Chat ---------------
        saveMsg(state, {message}){
            const board = state.board
            if (!board.messages) Vue.set(state.board, 'messages', [])
            board.messages.push(message)
            state.board = JSON.parse(JSON.stringify(board))
        }
    },
    actions: {
        // --------------- Board ---------------
        async loadBoard({ commit, dispatch }, { boardId }) {
            try {
                const board = await boardService.getBoardById(boardId)
                commit({ type: 'setBoard', board })
                const members = board?.members || []
                commit({ type: 'setMembers', members })
                localStorage.setItem(`board${boardId}`, JSON.stringify(board))
                return board
            } catch (error) {
                const board = JSON.parse(localStorage.getItem(`board${boardId}`))
                commit({ type: 'setBoard', board })
                const members = board?.members || []
                commit({ type: 'setMembers', members })

                commit({ type: 'setMsgTxt', txt: 'You are currently offline! Data will upload automatically when connection is back' })
                dispatch({ type: 'activeMsg', time: 6000 })

                return board

                console.error(error)
                throw error
            }
        },
        async saveBoard({ state, commit, dispatch }) {
            try {
                await boardService.updateBoard(state.board)
            } catch (error) {
                const action = {
                    func: 'updateBoard',
                    params: [JSON.parse(JSON.stringify(state.board))]
                }
                dispatch({ type: 'pushAction', action })

                commit({ type: 'setMsgTxt', txt: 'You are currently offline! Data will upload automatically when connection is back' })
                dispatch({ type: 'activeMsg', time: 6000 })
                console.error(error)
            }
        },
        async addBoard({ commit }, { title, style }) {
            try {
                const board = await boardService.addBoard(title, style)
                commit({ type: 'setBoard', board })
                return board
            } catch (error) {
                console.error(error)
            }
        },

        // --------------- TASK ---------------
        addTask({ getters, commit, dispatch }, payload) {
            const activity = {
                txt: 'Add Task',
                createdAt: Date.now(),
                byMember: getters.loggedinUser || {
                    _id: "u1",
                    username: "Guest",
                    fullname: "Guest User",
                    imgUrl: "https://i.imgur.com/8OP4tm2.png"
                },
            }
            commit({ type: 'pushTaskActivity', task: payload.taskToSave, activity })

            commit(payload)
            dispatch({ type: 'saveBoard' })
        },
        removeTask({ getters, commit, dispatch }, payload) {
            const activity = {
                txt: 'Remove Task',
                createdAt: Date.now(),
                byMember: getters.loggedinUser || {
                    _id: "u1",
                    username: "Guest",
                    fullname: "Guest User",
                    imgUrl: "https://i.imgur.com/8OP4tm2.png"
                },
            }
            commit({ type: 'pushBoardActivity', activity })

            commit(payload)
            dispatch({ type: 'saveBoard' })
        },
        saveTask({ commit, dispatch }, payload) {
            commit(payload)
            dispatch({ type: 'saveBoard' })
        },


        //  ------------- Group ---------------
        addGroup({ getters, commit, dispatch }, payload) {
            const activity = {
                txt: 'Add Group',
                createdAt: Date.now(),
                byMember: getters.loggedinUser || {
                    _id: "u1",
                    username: "Guest",
                    fullname: "Guest User",
                    imgUrl: "https://i.imgur.com/8OP4tm2.png"
                },
            }
            commit({ type: 'pushBoardActivity', activity })

            commit(payload)
            dispatch({ type: 'saveBoard' })
        },
        removeGroup({ getters, commit, dispatch }, payload) {
            const activity = {
                txt: 'Delete Group',
                createdAt: Date.now(),
                byMember: getters.loggedinUser || {
                    _id: "u1",
                    username: "Guest",
                    fullname: "Guest User",
                    imgUrl: "https://i.imgur.com/8OP4tm2.png"
                },
            }
            commit({ type: 'pushBoardActivity', activity })

            commit(payload)
            dispatch({ type: 'saveBoard' })
        },


        //  ------------- Labels ---------------
        // 1 - open
        // -1 - close
        // 0 - closing
        // 2 - opening
        // !unused
        saveLabels({ commit, dispatch }, payload) {
            commit(payload)
            dispatch({ type: 'saveBoard' })
        },


        //  ------------- Activities ---------------
        pushActivity({ commit, dispatch }, payload) {
            commit(payload)
            dispatch({ type: 'saveBoard' })
        },
    },
}

