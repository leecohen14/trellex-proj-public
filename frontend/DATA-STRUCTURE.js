// Guidelines
// *. Save the entire board / and later on the Task level, dont handle mini-updates
// *. No need for saving an activities array per task, those activities are easily filtered from the board activities
// *. activites - when board is updated, the frontend does not send the activities array within the board 
//    instead it only sends a new activity object: {txt, boardId, groupId, taskId}
//    the backend adds this activity to the board with $push and can also emit socket notificatios
// *. D & D Guidelines - vue draggable / react-beutiful-dnd
// *. Same model for Monday style app (do not implement a generic columns feature)
// *. boardStore no need for group/task stores
// *. rendering performance
// *. we do not handle concurrent editing - needs versioning
// *. render optimization


const board = {
    "_id": "b101",
    "title": "Robot dev proj",
    "isFavorite": false,
    "createdAt": 1589983468418,
    "createdBy": {
        "_id": "u101",
        "username": "Aviv",
        "fullname": "Aviv Ben Shahar",
        "imgUrl": "http://some-img"
    },
    "style": {bgUrl: null, bgColor: null},
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
                    "isDueDateDone": false,
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
                        "bgColor": "",
                        "bgUrl": "",
                        "isFull": false
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
}
const user = {
    "_id": "u101",
    "username": "Abi",
    "fullname": "Abi Abambi",
    "email": "abi@ababmi.com", // not needed
    "password": "aBambi123",
    "imgUrl": "http://some-img.jpg",
    "mentions": [{
        "id": "m101",
        "boardId": "m101",
        "taskId": "t101"
    }]
}

