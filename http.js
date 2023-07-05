/*********
注释事项：非常重要....................................
vant滑动组件每次渲染的时候都会初始化,导致索引被重置,我们需要找到node_modules\vant\es\swipe\index.js文件
在他watch下children添加判断
if(this.activeIndicator <= 0){
		  this.initialize();
  }
  来确保数据追加后不被重新初始化
  -- 废弃使用Scroll代替，不使用swipe了  2021-10-25
********/
import axios from 'axios'
import router from './src/router'
import Vue from 'vue'
// const baseURL = 'http://172.20.10.9:8080/mzzj_manage/mzzjcontroller'
// const baseURL = 'http://192.168.1.100:8088/mzzj_manage/mzzjcontroller'
const baseURL = 'http://192.168.137.72:8088/mzzj_manage/mzzjcontroller'
// const baseURL = 'https://8de2-125-105-83-114.ap.ngrok.io/mzzj_manage/mzzjcontroller'
// const baseURL = localStorage.getItem('address')
// const baseURL = 'http://121.201.2.228:10824'
// const baseURL = 'http://121.201.2.228:10958'
// const baseURL = 'http://127.0.0.1:8114'
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
	// config.headers['yctest'] = 'yctest__' // 测试时使用的密钥
    // config.headers['uuid'] = localStorage.uuid//获取设备的uuid进行传输
	config.headers['uuid'] = '78DC5E3B-3952-4CE9-8224-69C78D03103C';
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

http.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
	   Vue.prototype.$msg.clear()
	// websocket重连中,不提示错误消息
	if(!error.response || error.response.status == 401 || error.response.status == 402){
			 if(error.message.startsWith('timeout')){
				 // Vue.prototype.$msg.fail('系统维护中...')
				 Vue.prototype.$msg.fail('加载超时拉...')
			 }else if(error.message.startsWith('Network Error')){
				// Vue.prototype.$msg.fail('网络连接失败...')
			 }else{
				 Vue.prototype.$msg.fail('没有权限或系统维护中...')
			 }
	}
	if(error.response && error.response.status == 500){
			 Vue.prototype.$msg.fail('加载失败...')
	}
	 

    return Promise.reject(error);
  });




export default http
