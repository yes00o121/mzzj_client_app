import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vant from 'vant'
import {Toast} from 'vant'
import 'vant/lib/index.css';
import http from '../http'
import '@/assets/style.css'
Vue.prototype.$http = http
Vue.prototype.$msg = Toast

Vue.use(vant)

 //监听获取设备uuid
document.addEventListener('plusready', function(){
  localStorage.uuid = plus.device.uuid;
  plus.device.getInfo({
    success:function(e){
        // if(localStorage.uuid){
          localStorage.uuid = e.uuid
          // console.log('获取的设备uuid是' + localStorage.uuid)
        // }
    },
    fail:function(){
      alert('获取设备号失败')
    }
  })
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   // store,
//   // template: '<App/>',
//   components: { App }
// })