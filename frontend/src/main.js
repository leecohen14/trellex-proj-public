import Vue from 'vue'
import app from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// LIBS
import 'element-ui/lib/theme-chalk/index.css'
import ElementUi from 'element-ui'

Vue.use(ElementUi)
Vue.use(require('vue-moment'))

import VueDragscroll from 'vue-dragscroll'
Vue.use(VueDragscroll)

import Cloudinary, { CldImage, CldTransformation } from "cloudinary-vue"
Vue.use(Cloudinary, {
    configuration: { cloudName: "avivcloud" },
    components: {
        CldImage,
        CldTransformation
    }
})


import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import 'animate.css'




import './style/main.scss'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(app),
}).$mount('#app')
