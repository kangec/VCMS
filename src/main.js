import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.css'
import Element from 'element-ui'
import axios from 'axios'
import '@/icons' // icon
Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(VCharts);
Vue.prototype.$http = axios.create({
    baseURL: '/api/v1',
    timeout: 1000 * 60,
    headers: {
        Authorization: window.sessionStorage.getItem('token')
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
