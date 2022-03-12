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
Vue.use(Notify);
Vue.use(Panel);
Vue.use(VCharts)
Vue.use(VueClipboard)
 Vue.prototype.$NoSleep = NoSleep;

// import VueVideoPlayer from 'vue-video-player'
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
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   // store,
//   // template: '<App/>',
//   components: { App }
// })
