import axios from 'axios'
import router from './src/router'
import Vue from 'vue'
// const baseURL = 'http://127.0.0.1:8090'
const baseURL = 'http://192.168.1.109:8090'
// const baseURL = 'http://121.201.2.228:10824'
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
		// console.log('??????????????????????????')
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
     if(!error.response || error.response.status == 401 || error.response.status == 402){
         router.push('/')
		 console.log(error.message)
		 // alert(response.messag)
		 if(error.message.startsWith('timeout')){
			 Vue.prototype.$msg.fail('系统维护中...')
		 }else {
			 Vue.prototype.$msg.fail('没有权限...')
		 }
         
		 
     }

    return Promise.reject(error);
  });




export default http
