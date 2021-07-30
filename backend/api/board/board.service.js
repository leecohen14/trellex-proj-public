const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('board')

        const boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ '_id': ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const query = { _id: ObjectId(boardId) }
        await collection.deleteOne(query)
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function update(board) {
    try {
        // peek only updatable fields!
        // const boardToSave = {
        //     _id: ObjectId(board._id),
        //     title: board.title,
        //     createdAt: board.createdAt,
        //     isLabelsOpen: board.isLabelsOpen,
        //     labels:  board.labels,
        //     members: board.members,
        //     style: board.style
        // }
        board._id = ObjectId(board._id)
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ '_id': board._id }, { $set: board })

        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(board) {
    try {
        // peek only updatable fields!

        // const boardToAdd = {
        //     title: board.title,
        //     createdAt: board.createdAt,
        //     isLabelsOpen: board.isLabelsOpen,
        //     labels:  board.labels,
        //     members: board.members,
        //     style: board.style
        // }
        board.createdAt = Date.now()
        if (board.isStared === undefined) board.isStared = false
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy._id) criteria._id = filterBy._id
    return criteria
}

// async function addMsg(msg,boardId) {
//     try {        
//         // peek only updatable fields!
//         const msgToAdd = {
//             txt: msg.txt,
//             from: msg.from,
//         }
//         const collection = await dbService.getCollection('board')
//         // await collection.insertOne(boardToAdd)
//         collection.updateOne(
//                 {"_id":ObjectId(boardId)},
//                 { $push: {"chat": msg}}
//             )
//             console.log('msgToAdd :>> ', msgToAdd);
//         return msgToAdd
//     } catch (err) {
//         logger.error('cannot insert msg', err)
//         throw err
//     }
// }

// function _buildCriteria(filterBy) { 
//     const criteria = {}
//     if (filterBy.txt) {
//         const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
//         criteria.name = txtCriteria
//     }
//     if(filterBy.filter && filterBy.filter !== 'All'){
//         if(filterBy.filter === 'inStock') criteria.inStock = true
//         else criteria.inStock = false
//     }
//     if(filterBy.type && filterBy.type !== 'All'){
//         criteria.type = filterBy.type
//     }
//     return criteria
// }

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    // addMsg
}