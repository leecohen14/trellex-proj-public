const boardService = require('./board.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getBoard(req, res) {
    try {
        const { user } = req.session
        const { boardId } = req.params

        // Refresh guest user by admin
        if (user._id === '60f97c78d1f5776c24fcd8f9') {
            const fiveHours = 1000 * 60 * 60 * 5
            // const fiveHours = 1000 * 60

            if (!user.lastUpdated || user.lastUpdated < Date.now() - fiveHours) await _updateGuestBoards(user)
        }

        if (!user.boardsIds || !user.boardsIds.includes(boardId)) {
            res.status(401).send({ err: 'Not allowed to access that board!' })
            return
        }

        const board = await boardService.getById(req.params.boardId)

        res.send(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

async function getBoards(req, res) {
    // add filter of boards by user
    try {
        const { user } = req.session
        const boards = []

        if (user._id === '60f97c78d1f5776c24fcd8f9') {
            const fiveHours = 1000 * 60 * 60 * 5
            // const fiveHours = 1000 * 60
            if (!user.lastUpdated || user.lastUpdated < Date.now() - fiveHours) await _updateGuestBoards(user)
        }

        // await Promise.all(user.boardsIds.map(async (boardId) => {
        //     const board = await boardService.getById(boardId)
        //     if (!board) res.send(null)
        //     const b = { _id: board._id, title: board.title, style: board.style }
        //     boards.push(b)
        // }))
        for (const boardId of user.boardsIds) {
            const board = await boardService.getById(boardId)
            if (board) {
                const b = { _id: board._id, title: board.title, style: board.style }
                boards.push(b)
            }
        }


        res.send(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

async function _updateGuestBoards(user) {
    try {
        const admin = await userService.getById('60f97af8a235c46cacd3e3e8')
        if (!admin) return
        const boardsIds = admin.boardsIds || []
        const guestBoardsIds = []

        for (const boardId of boardsIds) {
            const board = await boardService.getById(boardId)
            const newBoard = JSON.parse(JSON.stringify(board))
            delete newBoard._id

            const guestSmallProfile = {
                "_id": "60f97c78d1f5776c24fcd8f9",
                "username": "guest",
                "fullname": "Guest User",
                "score": 0,
                "imgUrl": "https://phillipbrande.files.wordpress.com/2013/10/random-pic-14.jpg"
            }
            newBoard.members.push(guestSmallProfile)

            const b = await boardService.add(newBoard)
            guestBoardsIds.push(b._id.toString())
        }


        // Updating boards Ids in deep copy
        // await Promise.all(boardsIds.map(async (boardId) => {
        //     const board = await boardService.getById(boardId)
        //     const newBoard = JSON.parse(JSON.stringify(board))
        //     delete newBoard._id

        //     const b = await boardService.add(newBoard)

        //     // Updating members boards Ids
        //     // await Promise.all(b.members.map(async (member) => {
        //     //     const m = await userService.getById(member._id)
        //     //     m.boardsIds = (m.boardsIds) ? m.boardsIds : []
        //     //     m.boardsIds.push(b._id)

        //     //     await userService.update(member)
        //     // }))

        //     guestBoardsIds.push(b._id.toString())
        // }))



        user.boardsIds = guestBoardsIds
        user.lastUpdated = Date.now()

        await userService.update(user)
    } catch (error) {

    }
    // !Delete guest boards!
    // const prms = []
    // user.boardsIds.forEach(boardId => {
    //     prms.push(boardService.remove(boardId))
    // })
    // await Promise.all(prms)
}

async function deleteBoard(req, res) {
    try {
        await boardService.remove(req.params.id)
        // socketService.broadcast('board-updated', board._id)

        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}

async function updateBoard(req, res) {
    try {
        const { board } = req.body
        const savedBoard = await boardService.update(board)
        socketService.broadcast({ type: 'board-updated', data: board._id, room: board._id })

        res.send(savedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

async function addBoard(req, res) {
    try {
        let { board } = req.body
        const { user } = req.session
        board.createdBy = user
        board.members.push(board.createdBy)
        board = await boardService.add(board)

        user.boardsIds = !user.boardsIds ? [] : user.boardsIds
        user.boardsIds.push(board._id.toString())

        await userService.update(user)

        console.log('CTRL SessionId:', req.sessionID)
        // socketService.broadcast({ type: 'board-updated', data: board._id, room: board._id })

        res.send(board)
    } catch (err) {
        console.log(err)
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}


module.exports = {
    getBoard,
    getBoards,
    deleteBoard,
    updateBoard,
    addBoard,
    // addMsg
}