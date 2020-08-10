import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index.js'
import './plugins/element.js'
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);
import './plugins/axios.js'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import htmlToPdf from '@/utils/htmlToPdf.js'
Vue.use(htmlToPdf)

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'vue-video-player/node_modules/video.js/dist/video-js.css'
Vue.use(VideoPlayer)

import './plugins/rem.js'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
