import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import {Toast} from 'vant'
import 'vant/lib/index.css';
import '@/common/stylus/index.styl'
import http from '../http'
import '@/assets/style.css'
import VueTouch from 'vue-touch' // 提示框
import { Uploader } from 'vant'; // 附件上传
import { Icon } from 'vant'; // 图标
import VueCropper from 'vue-cropper' // 图片裁剪
import { Sticky } from 'vant'; // 粘性布局
import { SwipeCell } from 'vant';
import 'video.js/dist/video-js.css'
import videojs from 'video.js';
import NoSleep from "nosleep.js/dist/NoSleep.min.js";
import VueClipboard from 'vue-clipboard2' // 复制包
import VCharts from 'v-charts-v2' // 图表
import { Panel } from 'vant';
import { Notify } from 'vant'; // 消息组件
import { mapGetters, mapMutations } from 'vuex' // 缓存
import BScroll from '@better-scroll/core'
import ObserveImage from '@better-scroll/observe-image'


BScroll.use(ObserveImage) // 滚动图片高度自动计算器
Vue.use(Notify);
Vue.use(Panel);
Vue.use(VCharts)
Vue.use(VueClipboard)
 Vue.prototype.$NoSleep = NoSleep;
// import VueVideoPlayer from 'vue-video-player'
// 添加全局请求头
videojs.Vhs.xhr.beforeRequest = function (options) {
  let headers = options.headers || {};
  // headers["headers1"] = "headers1";
  // headers["headers2"] = "headers2";
  // headers["uuid"] = '78DC5E3B-3952-4CE9-8224-69C78D03103C';
  options.uri += '?token=' + localStorage.token
  console.log(localStorage.curPixel)
  if(localStorage.curPixel){
	  headers["pixel"] = localStorage.curPixel
  }
  options.headers = headers;

  return options;
};
Vue.prototype.$video = videojs //引入Video播放器



import 'vue-video-player/src/custom-theme.css'
// Vue.use(VueVideoPlayer);
import loadingIndex from "./components/loadingIndex";
Vue.use(loadingIndex);

import '../public/static/css/iconfont.css'
import utils from 'km-vue-utils'
import { Lazyload } from 'vant';
import { Dialog } from 'vant';
import { DatetimePicker } from 'vant';
import { Slider } from 'vant';

Vue.use(Slider);
Vue.use(DatetimePicker);
// 全局注册
Vue.use(Dialog);

Vue.use(Lazyload);
Vue.use(utils);
Vue.prototype.$utils = utils;
Vue.prototype.$http = http
Vue.prototype.$msg = Toast
Vue.config.productionTip = false;
Vue.use(vant)
Vue.use(Uploader);
Vue.use(Icon);
Vue.use(VueCropper);
Vue.use(Sticky);
Vue.use(SwipeCell);
Vue.use(VueTouch, {name: 'v-touch'})
 VueTouch.config.swipe = {
      threshold: 100 //手指左右滑动距离
 }


//plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
// plus.screen.lockOrientation( 'landscape-primary');
// 当前滚动的视频数据,用于做页面切换后的视频控制
Vue.prototype.curScrollVideo = {}


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
      // alert('获取设备号失败')
	  alert('加载错误,请联系管理员')
    }
  })
})

Vue.prototype.getUser = async  function(){
  if(localStorage.getItem('token')){
    const res = await this.$http.get('/admin/info')
    return res;
  }
  return null;
}


Vue.prototype.httpTimeout = 5000; // http接口超时时长

Vue.prototype.windowHeight = screen.height // 获取用户屏幕高度

Vue.prototype.windowWidth = screen.width // 获取用户屏幕宽度

Vue.prototype.pageScroll = {A:'10'} // 页面所有滚动位置

Vue.prototype.showPageTool = true// 短视频是否简约莫是

// 全局消息对象
Vue.prototype.overallMessage = {}

Vue.prototype.websocket = null; // 全局的websocket对象

		// 创建websocket连接
Vue.prototype.createWebSocket = function(){
	
	try{
		if(localStorage.token){
		
		// 创建之前先获取当前用户信息,加载下用户缓存,避免无法获取用户
		this.$http.get('/admin/info').then(res=>{
			let _this = this
			// 建立websocket连接
			let websocketUrl = this.baseURL.replace('http','ws') + '/websocket?token=' + localStorage.getItem('token')
			// let websocketUrl = 'ws://192.168.1.113:8095/websocket?token='
			Vue.prototype.websocket = new WebSocket(websocketUrl);
			console.log(this.websocket)
			Vue.prototype.websocket.onclose=function(){//连接关闭监听
				console.log('websocket连接关闭');
				// 关闭后重新连接
				Vue.prototype.reconnect()
			}
			Vue.prototype.websocket.onmessage = (event=>{
					  //接收消息方法
					  console.log(event)
					  console.log('websocket接收消息');
		
					   let data = JSON.parse(event.data) // 接收消息
					   // 判断消息类型
					   if(data.msgType == 'STATISTICS'){
						   // 统计消息,将消息写入localStorage该类统计实时各类消息情况
						   console.log('统计消息....')
						   // 统计消息数量
						   Vue.prototype.initMessage(data);
					   }else if(data.msgType == 'TIPS'){
						   // 提示消息直接显示title
						   _this.$notify({
								message: data.title,
								  duration: 2000,
								  type: 'primary'
						   })
					   }else if(data.msgType == 'COMMENT' || data.msgType == 'FORWARD'){
						   // 判断是否在消息页面,在消息页面直接追加数据,否则弹出窗口
						   if(_this.$route.name == 'messageDetail'){
							   console.log(_this)
							   // top.c = this
							   store.state.websocketSendData = data
							   for(let i =0;i<store.getters.messageList.length;i++){
								// 更新缓存
								if(data.message.user_id == store.getters.messageList[i].user_id){
								   store.getters.messageList[i].messageContent = data.message.content
								   console.log(store.getters.messageList[i])
									store.getters.messageList[i].lastTime = data.message.lastTime
									Object.assign(store.getters.messageList[i],data.message)
									// 在页面把未读数量改成0
									store.getters.messageList[i].noReadNum = 0
								}
							   }
						   }else{
							   // 更新消息数量
							   let messageTotalNum = 0
							   // 消息总数更新
							   for(let i =0;i<store.getters.messageList.length;i++){
								   messageTotalNum = messageTotalNum + (store.getters.messageList[i].noReadNum ? store.getters.messageList[i].noReadNum : 0)
			
								   if(data.message.user_id == store.getters.messageList[i].user_id){
									   // _this.$store.getters.messageList[i].messageContent = data.message.messageContent
										// _this.$store.getters.messageList[i].lastTime = data.message.lastTime
										store.getters.messageList[i].messageContent = data.message.content
										console.log(store.getters.messageList[i])
										store.getters.messageList[i].lastTime = data.message.lastTime
										Object.assign(store.getters.messageList[i],data.message)
									   if(store.getters.messageList[i].noReadNum > 99){
										   store.getters.messageList[i].noReadNum = '99+'
									   }else{
										   // console.log(_this.$store.getters.messageList[i].noReadNum)
										   store.getters.messageList[i].noReadNum = store.getters.messageList[i].noReadNum + 1
										   // console.log(_this.$store.getters.messageList[i].noReadNum)
										   messageTotalNum += 1
									   }
								   }
							   }
							   console.log(store.getters.messageTotalNum)
							   if(store.getters.messageTotalNum != '99+'){
									store._mutations.SET_MESSAGE_TOTAL_NUM[0](messageTotalNum)		   
							   }else{
								   store._mutations.SET_MESSAGE_TOTAL_NUM[0]('99+')
							   }
							   
							   // 评论消息,弹出提示窗口
							   _this.$notify({
								message: data.title + '\n' + data.message.content,
								  duration: 2000,
								  type: 'success'
							   })
						   }
			
					   }
					   console.log(store.getters.messageList)
					   
			})
			//连接响应
			Vue.prototype.websocket.onopen = function(){
			  console.log('websocket连接达成');
			  
			}
			Vue.prototype.websocket.onerror = function(){
			  console.log('websocket错误');
			  // this.reconnect() // 重连
			  Vue.prototype.reconnect()
			}
			window.onbeforeunload = ()=>{
				console.log('被关闭了......')
			   if(Vue.prototype.websocket != null){
				   Vue.prototype.websocket.close();
			   }
			}
			}).catch(res=>{
				console.log('获取用户失败...')
				// 网络中断,重连
				Vue.prototype.reconnect()
			})
		}
	}catch(e){
		console.log('连接失败》。。。。')
	}

}

// 初始化内容
Vue.prototype.initMessage = function(data){
	console.log('初始化了》。。。')
	// 判断用户是否登陆,登陆创建连接
	if(localStorage.token){
		let messageNum = 0;
		if(data){
			top.a = Vue
			store._mutations.CLEAR_MESSAGE_LIST[0]();
			for(let i =0;i<data.message.length;i++){
				messageNum += data.message[i].noReadNum ? data.message[i].noReadNum : 0
				// this.overallMessage.messageMap.set(data.message[i].user_id,data.message[i])
				store._mutations.APPEND_MESSAGE_LIST[0](data.message[i])
			}
			// console.log(this.$store.getters.messageList())
			if(messageNum > 99){
				messageNum = '99+'
			}
			console.log(messageNum + '..............')
			store._mutations.SET_MESSAGE_TOTAL_NUM[0](messageNum)
		}
	}

}

Vue.prototype.lockReconnect = false // 避免重连

// websocket重连
Vue.prototype.reconnect = function(url) {
        if(Vue.prototype.lockReconnect) return;
        Vue.prototype.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function () {
			console.log('正在重来你.......')
			Vue.prototype.createWebSocket();
            Vue.prototype.lockReconnect = false;
        }, 2000);
    }
// Vue.prototype.reconnect()


// 图标列表
Vue.prototype.Highlightlist = [
					{img: './static/emoticom/aixin.png'},
					{img: './static/emoticom/aojiao.png'},
					{img: './static/emoticom/call.png'},
					{img: './static/emoticom/chigua.png'},
					{img: './static/emoticom/dai.png'},
					{img: './static/emoticom/daku.png'},
					{img: './static/emoticom/daxiao.png'},
					{img: './static/emoticom/ganga.png'},
					{img: './static/emoticom/goutou.png'},
					{img: './static/emoticom/haixiu.png'},
					{img: './static/emoticom/huafengtubian.png'},
					{img: './static/emoticom/huaji.png'},
					{img: './static/emoticom/jianxiao.png'},
					{img: './static/emoticom/jingli.png'},
					{img: './static/emoticom/jingxi.png'},
					{img: './static/emoticom/jingya.png'},
					{img: './static/emoticom/jiong.png'},
					{img: './static/emoticom/koubi.png'},
					{img: './static/emoticom/leng.png'},
					{img: './static/emoticom/miaoa.png'},
					{img: './static/emoticom/shengbing.png'},
					{img: './static/emoticom/shengqi.png'},
					{img: './static/emoticom/suan.png'},
					{img: './static/emoticom/teng.png'},
					{img: './static/emoticom/tiaopi.png'},
					{img: './static/emoticom/touxiao.png'},
					{img: './static/emoticom/tu.png'},
					{img: './static/emoticom/weiqu.png'},
					{img: './static/emoticom/weixiao.png'},
					{img: './static/emoticom/wulian.png'},
					{img: './static/emoticom/wuyu.png'},
					{img: './static/emoticom/xia.png'},
					{img: './static/emoticom/xiangzhi.png'},
					{img: './static/emoticom/xianqi.png'},
					{img: './static/emoticom/xiaoku.png'},
					{img: './static/emoticom/xiaokule.png'},
					{img: './static/emoticom/xihuan.png'},
					{img: './static/emoticom/xusheng.png'},
					{img: './static/emoticom/yinxiang.png'},
					{img: './static/emoticom/zan.png'},
					{img: './static/emoticom/zhichi.png'}
		  ],


// 跳转到指定y轴位置
Vue.prototype.slideTo = function(targetPageY,el) {
		  var timer = setInterval(function () {
		      var currentY = !el ? (document.documentElement.scrollTop || document.body.scrollTop) : el.scrollTop;//当前及滑动中任意时刻位置
			  // console.log(currentY)
		      var distance = targetPageY > currentY ? targetPageY - currentY : currentY - targetPageY;//剩余距离
		      var speed = Math.ceil(distance/10);//每时刻速度
		      if (currentY == targetPageY) {
		       clearInterval(timer);
		      } else {
				  if(!el){
					window.scrollTo(0,targetPageY > currentY ? currentY + speed : currentY - speed);
				  }else{
					  el.scrollTo(0,targetPageY > currentY ? currentY + speed : currentY - speed)
				  }

		      }
			  // 不管如何,1秒后关闭定时任务,避免出现不能滚动问题
			  setTimeout(()=>{
				  clearInterval(timer);
			  },1000)
		     },10);
		 }

// 页面横线展示
Vue.prototype.transverse = ()=>{
	plus.screen.lockOrientation( 'landscape-primary');
}
// 页面纵向展示
Vue.prototype.longitudinal =()=>{
	plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
}

Vue.prototype.showloading = function() {
	var title = "加载中···";
	this.$showLoading({
	  title: title
	});
}

Vue.prototype.hideloading = function() {
	this.$cancelLoading();
  }



new Vue({
  store,
  router,
  // methods:{
	 //  ...mapMutations([
	 //  	'SET_MESSAGE_TOTAL_NUM',
	 //  	'APPEND_MESSAGE_LIST',
	 //  	'CLEAR_MESSAGE_LIST',
	  	
	 //  ]),
	 //  ...mapGetters([
	 //  	'messageTotalNum',
	 //  	'messageList'
	 //  ]),
  // },
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   // store,
//   // template: '<App/>',
//   components: { App }
// })
