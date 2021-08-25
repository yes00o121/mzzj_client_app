/*********
注释事项：非常重要....................................
vant滑动组件每次渲染的时候都会初始化,导致索引被重置,我们需要找到node_modules\vant\es\swipe\index.js文件
在他watch下children添加判断
if(this.activeIndicator <= 0){
		  this.initialize();
  }
  来确保数据追加后不被重新初始化
********/
import axios from 'axios'
import router from './src/router'
import Vue from 'vue'
// const baseURL = 'http://127.0.0.1:8090'
// const baseURL = 'http://192.168.1.6:8090'
const baseURL = 'http://121.201.2.228:10824'
Vue.prototype.baseURL = baseURL
const http = axios.create({
	baseURL
    // baseURL:'http://112.74.99.5:3000/web/api'
    // baseURL:'http://121.201.2.228:10824'
    // baseURL:'http://192.168.1.100:8095'
    // baseURL:'http://192.168.125.116:8095'
})


http.interceptors.request.use(function (config) {
	// console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')){
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    } 

    config.headers['uuid'] = localStorage.uuid//获取设备的uuid进行传输
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

http.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
	  console.log(error)
	  Vue.prototype.hideloading()
     if(!error.response || error.response.status == 401 || error.response.status == 402){
         router.push('/')
		 console.log(error.message)
		 // alert(response.messag)
		 if(error.message.startsWith('timeout')){
			 Vue.prototype.$msg.fail('系统维护中...')
		 }else {
			 // Vue.prototype.$msg.fail('没有权限...')
			 Vue.prototype.$msg.fail('加载超时拉...')
		 }
         
		 
     }

    return Promise.reject(error);
  });




export default http
