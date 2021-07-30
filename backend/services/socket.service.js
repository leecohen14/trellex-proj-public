const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http)
    const sharedSession = require('express-socket.io-session')

    gIo.use(sharedSession(session, {
        autoSave: true
    }))
    gIo.on('connection', socket => {
        // console.log('New socket', socket.id)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        socket.on('disconnect', socket => {
            // console.log('Someone disconnected')
            // console.log('socket :>> ', socket)
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        // socket.on('board-updated', boardId => {
        //     // broadcast({ type: 'board-updated', data: board._id })
        //     // emits to all sockets:
        //     gIo.emit('board-updated', boardId)
        //     // emits only to sockets in the same room
        //     // gIo.to(socket.myTopic).emit('chat addMsg', msg)
        // })

        socket.on('register-board', boardId => {
            console.log('🚀 ~ boardId', boardId)
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(boardId)
            socket.myTopic = boardId
        })

        // socket.on('chat newMsg', msg => {
        //     // emits to all sockets:
        //     // gIo.emit('chat addMsg', msg)
        //     // emits only to sockets in the same room
        //     gIo.to(socket.myTopic).emit('chat addMsg', msg)
        // })
        socket.on('user-watch-task', ({ userId, taskId, taskTitle }) => {
            socket.join('watching:' + taskId)
            socket.taskId = taskId
            socket.userId = userId

            broadcast({ type: 'user-watch-task', data: { taskId, userId, taskTitle }, userId })
        })
        socket.on('add-msg', ({message, boardId}) => {
            console.log('message, boardId :>> ', message, boardId);
            broadcast({ type: 'add-msg', data: message, room: boardId})


            // broadcast({ type: 'user-watch-task', data: { taskId, userId, taskTitle }, userId })
        })
        // socket.on('set-user-socket', userId => {
        //     logger.debug(`Setting socket.userId = ${userId}`)
        //     socket.userId = userId
        // })
        // socket.on('unset-user-socket', () => {
        //     delete socket.userId
        // })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data)
    else gIo.emit(type, data)
}

function emitToUser({ type, data, userId }) {
    logger.debug('Emiting to user socket: ' + userId)
    const socket = _getUserSocket(userId)
    if (socket) socket.emit(type, data)
    else {
        console.log('User socket not found')
        _printSockets()
    }
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null, userId }) {
    const excludedSocket = _getUserSocket(userId)
    if (!excludedSocket) {
        logger.debug('Shouldnt happen, socket not found')
        _printSockets()
        return
    }
    logger.debug('broadcast to all but user: ', userId)
    if (room) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else {
        excludedSocket.broadcast.emit(type, data)
    }
}

function _getUserSocket(userId) {
    const sockets = _getAllSockets()
    const socket = sockets.find(s => s.userId == userId)
    return socket
}
function _getAllSockets() {
    const socketIds = Object.keys(gIo.sockets.sockets)
    const sockets = socketIds.map(socketId => gIo.sockets.sockets[socketId])
    return sockets
}

function _printSockets() {
    const sockets = _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    connectSockets,
    emitTo,
    emitToUser,
    broadcast,
}



