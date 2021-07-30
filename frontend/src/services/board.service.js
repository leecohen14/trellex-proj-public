// import { storageService } from "./async-storage.service"
import { httpService } from "./http.service"
// import { utilService } from "./util.service.js"

const KEY = 'BOARD'
export const boardService = {
    query,
    getBoardById,
    removeBoard,
    addBoard,
    updateBoard, //should be save
    getEmptyBoard
    // getReviews,
    // removeReview,
    // addReview,
}

// _createBoards()

function query() {
    // return storageService.query(KEY)
    return httpService.get('board')
}

function getBoardById(id) {
    // return storageService.get(KEY, id)
    return httpService.get(`board/${id}`)
}

function removeBoard(id) {
    // return storageService.remove(KEY, id)
    return httpService.delete(`board/${id}`)
}

function addBoard(title, style) {
    // return storageService.remove(KEY, id)
    const board = getEmptyBoard(title)
    board.style = style
    return updateBoard(board)
}

function updateBoard(board) {
    // const savedBoard = (board._id) ? storageService.put(KEY, board) : storageService.post(KEY, board)
    // return savedBoard
    if (board._id) return httpService.put('board', { board })
    return httpService.post('board', { board })
}

function getEmptyBoard(title = 'New board') {
    return {
        title,
        createdAt: Date.now(),
        isLabelsOpen: -1,
        labels: [
            { title: '', color: '#61bd4f', id: 'l101' },
            { title: '', color: '#f2d600', id: 'l102' },
            { title: '', color: '#ff9f1a', id: 'l103' },
            { title: '', color: '#eb5a46', id: 'l104' },
            { title: '', color: '#0079bf', id: 'l105' },
            { title: '', color: '#00c2e0', id: 'l106' },
        ],
        members: [],
        style: {
            bgColor: '',
            bgImgUrl: '',
        }
    }
}

function _createBoards() {
    console.log('creating')
    var boards = JSON.parse(localStorage.getItem(KEY))
    if (!boards) {
        boards = [{
            "_id": "b101",
            "title": "Robot dev proj",
            "createdAt": 1589983468418,
            "createdBy": {
                "_id": "u101",
                "username": "Aviv",
                "fullname": "Aviv Ben Shahar",
                "imgUrl": "http://some-img"
            },
            "style": {},
            "isLabelsOpen": -1,
            "labels": [
                { "title": '', "color": '#61bd4f', "id": 'l101' },
                { "title": '', "color": '#f2d600', "id": 'l102' },
                { "title": '', "color": '#ff9f1a', "id": 'l103' },
                { "title": '', "color": '#eb5a46', "id": 'l104' },
                { "title": '', "color": '#0079bf', "id": 'l105' },
                { "title": '', "color": '#00c2e0', "id": 'l106' },
            ],
            "members": [
                {
                    "_id": "u101",
                    "username": "Lee",
                    "fullname": "Lee Cohen",
                    "imgUrl": "https://i.imgur.com/D4VUwSp.png"
                },
                {
                    "_id": "u102",
                    "username": "Aviv",
                    "fullname": "Aviv Ben Shahar",
                    "imgUrl": "https://i.imgur.com/8OP4tm2.png"

                },
                {
                    "_id": "u103",
                    "username": "Arthur",
                    "fullname": "Arthur Shtein",
                    "imgUrl": "https://i.imgur.com/nrri0G2.png"
                },
                {
                    "_id": "u104",
                    "username": "Guy",
                    "fullname": "Guy Zohar",
                    "imgUrl": "https://i.imgur.com/ZBX0PXF.png"
                }
            ],
            "groups": [
                {
                    "id": "g101",
                    "title": "Group 1",
                    "tasks": [
                        {
                            "id": "c101",
                            "title": "Replace logo"
                        },
                        {
                            "id": "c102",
                            "title": "Add Samples"
                        }
                    ],
                },
                {
                    "id": "g102",
                    "title": "Group 2",
                    "tasks": [
                        {
                            "id": "c103",
                            "title": "Do that"
                        },
                        {
                            "id": "c104",
                            "title": "Help me",
                            "description": "description",
                            "comments": [
                                {
                                    "id": "ZdPnm",
                                    "txt": "also @yaronb please CR this",
                                    "createdAt": 1590999817436.0,
                                    "byMember": {
                                        "_id": "u101",
                                        "username": "Lee",
                                        "fullname": "Lee Cohen",
                                        "imgUrl": "https://i.imgur.com/D4VUwSp.png"
                                    }
                                }
                            ],
                            "checklists": [
                                {
                                    "id": "YEhmF",
                                    "title": "Checklist",
                                    "todos": [
                                        {
                                            "id": "212jX",
                                            "title": "To Do 1",
                                            "isDone": false
                                        }
                                    ]
                                }
                            ],
                            "members": [
                                {
                                    "_id": "u101",
                                    "username": "Lee",
                                    "fullname": "Lee Cohen",
                                    "imgUrl": "https://i.imgur.com/D4VUwSp.png"
                                },
                                {
                                    "_id": "u103",
                                    "username": "Arthur",
                                    "fullname": "Arthur Shtein",
                                    "imgUrl": "https://i.imgur.com/nrri0G2.png"
                                },
                            ],
                            "labelIds": ["l101", "l102"],
                            "createdAt": 1590999730348,
                            "dueDate": null,
                            "byMember": {
                                "_id": "u101",
                                "username": "Lee",
                                "fullname": "Lee Cohen",
                                "imgUrl": "https://i.imgur.com/D4VUwSp.png"
                            },
                            "activities": [{
                                "txt": "Changed Color",
                                "createdAt": 1625816076030,
                                "byMember": {
                                    "_id": "u101",
                                    "username": "Aviv",
                                    "fullname": "Aviv Ben Shahar",
                                    "imgUrl": "https://i.imgur.com/8OP4tm2.png"
                                },
                            },
                            {
                                "txt": "Changed group",
                                "createdAt": 1625816076030,
                                "byMember": {
                                    "_id": "u102",
                                    "username": "Arthur",
                                    "fullname": "Arthur Shtein",
                                    "imgUrl": "https://i.imgur.com/nrri0G2.png"
                                },
                            }

                            ],
                            "cover": {
                                "isFull": false,
                                "bgColor": ""
                            }
                        }
                    ],
                }
            ],
            "activities": [
                {
                    "id": "a101",
                    "txt": "Changed Color",
                    "createdAt": 154514,
                    "byMember": {
                        "_id": "u101",
                        "username": "Aviv",
                        "fullname": "Aviv Ben Shahar",
                        "imgUrl": "https://i.imgur.com/8OP4tm2.png"
                    },
                    "task": {
                        "id": "c101",
                        "title": "Replace Logo"
                    }
                }
            ]
        }]
        localStorage.setItem(KEY, JSON.stringify(boards))
    }
    return boards
}









// ------------------ GROUP -------------------


// async function getReviews(boardId) {
//     return httpService.get('review/', { boardId })
// }

// async function removeReview(boardId, reviewId) {
//     return httpService.delete('review/', { boardId, reviewId })
// }

// async function addReview(boardId, newReview) {
//     const review = {
//         "id": utilService.makeId(),
//         "txt": newReview.txt,
//         "at": Date.now()
//     }
//     return httpService.post('review/', { newReview: review, boardId })
// }


