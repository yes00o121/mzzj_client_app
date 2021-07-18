import axios from 'axios'
import router from './src/router'
import Vue from 'vue'
const baseURL = 'http://192.168.125.117:8090'
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
     if(!error.response || error.response.status == 401 || error.response.status == 402){
         router.push('/login')
         Vue.prototype.$msg.fail(error.response.data.message)
     }

    return Promise.reject(error);
  });


export default http
