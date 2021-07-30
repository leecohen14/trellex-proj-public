import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import signup from '../views/signup.vue'
import board from '../views/board.vue'
import details from '../views/task-details.vue'
import statistics from '../views/statistics.vue'
import boardChat from '../cmps/board-chat.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: home
    },

    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/signup',
        name: 'signup',
        component: signup
    },
    {
        path: '/board/:boardId/',
        name: 'board',
        component: board,
        children: [
            {
                path: 'details/:groupId/:taskId',
                name: 'details',
                component: details
            },
            {
                path: 'statistics',
                name: 'statistics',
                component: statistics
            }
        ]
    },
    {
        path: '/test',
        name: 'test',
        component: boardChat
    },
]

const router = new VueRouter({
    routes
})

export default router

