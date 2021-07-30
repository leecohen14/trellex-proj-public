const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addBoard, getBoards, getBoard, deleteBoard, updateBoard } = require('./board.controller')
const router = express.Router()

router.get('/', requireAuth, getBoards)
router.get('/:boardId', requireAuth, getBoard)

router.put('/', requireAuth, updateBoard)
router.post('/', requireAuth, addBoard)
router.delete('/:id', requireAuth, deleteBoard)

module.exports = router
