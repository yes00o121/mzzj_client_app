<template>

	  <div id="app" >
		  			  <!-- <van-notice-bar text="通知内容" left-icon="volume-o" /> -->
		  <!-- <transition :name="transitionName"> -->
			<keep-alive v-if="isLoggedIn">
				<!-- <transition :name="transitionName"> -->
				<router-view v-if="$route.meta.keepalive && !equipmentCheck" />
				<!-- </transition> -->
			</keep-alive>
			<!-- </transition> -->
			<!-- <transition :name="transitionName"> -->
				<router-view v-if="(!$route.meta.keepalive && !equipmentCheck) || !isLoggedIn"></router-view>
			<!-- </transition> -->
			  <div v-if="equipmentCheck" style="position: absolute;
			  right: 50%;
			  top: 50%;color: black;">
					<strong>
						请使用移动设备进行访问
					</strong>
			  </div>
<!-- 			  <div v-show="isShow" :style="'transition: 3s;height:' + height">
				  <div style="height:4rem;width:96%;background:rgb(241 241 241);z-index:9999;position:absolute;top:0rem;border-radius:20px;margin-left:2%;margin-top:1rem;">
				  				  <div style="height:1rem;flot:left;width:100%;">
				  					 <van-image ref="workImage" round="16" lazy-load :src="baseURL +'/common/image?imgId=61b88b894316b402bcbf833f&token=' + token" style="top:.5rem;width:25px;position:absolute;left:0;padding-left:1rem;" />
				  					<span style="top:.8rem;width:100%;position:absolute;left:0;padding-left:3rem;text-align:left">薄荷七喜</span>
				  					<span style="top:.8rem;width:100%;position:absolute;right:0;padding-right:3rem;text-align:right">上午10：23</span>
				  					<div style="top:2.7rem;width:100%;position:absolute;left:0;padding-left:1rem;text-align:left">你有一条</div>
				  				</div>
			  </div>
			  </div> -->
<!-- 			  <div v-show="isShow" :style="'transition: 3s;height:' + height">
			  				  <div style="height:4rem;width:96%;background:rgb(241 241 241);z-index:9999;position:absolute;top:0rem;border-radius:20px;margin-left:2%;margin-top:1rem;">
			  				  				  <div style="height:1rem;flot:left;width:100%;">
			  				  					 <van-image ref="workImage" round="16" lazy-load :src="baseURL +'/common/image?imgId=61b88b894316b402bcbf833f&token=' + token" style="top:.5rem;width:25px;position:absolute;left:0;padding-left:1rem;" />
			  				  					<span style="top:.8rem;width:100%;position:absolute;left:0;padding-left:3rem;text-align:left">薄荷七喜</span>
			  				  					<span style="top:.8rem;width:100%;position:absolute;right:0;padding-right:3rem;text-align:right">上午10：23</span>
			  				  					<div style="top:2.7rem;width:100%;position:absolute;left:0;padding-left:1rem;text-align:left">你有一条</div>
			  				  				</div>
			  </div>
			  </div> -->
	  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default{
	name:'catch_components',
	data(){
		return {
			equipmentCheck:false,
			// height:'0px',
			// isShow:false,
			token: 'Bearer ' + localStorage.token,
			isLoggedIn:false, // 控制退出清除会话
			transitionName:'',
			// websocket:null // websocket
		}
	},
	created(){
		// 判断当前设置,如果是电脑禁止访问
		if(navigator.appVersion.indexOf('Mobile') == -1){
			this.equipmentCheck = true
		}
		
	},
	mounted(){

	},
	methods:{
		...mapMutations([
			'SET_MESSAGE_TOTAL_NUM',
			'APPEND_MESSAGE_LIST',
			'CLEAR_MESSAGE_LIST',
			
		]),
		...mapGetters([
			'messageTotalNum',
			'messageList'
		]),
		// 初始化消息数据
		initMessage(data){
			// console.log(data)
			let messageNum = 0;
			// let statistics = localStorage.getItem('statistics')
			if(data){
				this.CLEAR_MESSAGE_LIST();
				for(let i =0;i<data.message.length;i++){
					messageNum += data.message[i].noReadNum ? data.message[i].noReadNum : 0
					// this.overallMessage.messageMap.set(data.message[i].user_id,data.message[i])
					this.APPEND_MESSAGE_LIST(data.message[i])
				}
				console.log(this.messageList())
				if(messageNum > 99){
					messageNum = '99+'
				}
				console.log(messageNum + '..............')
				this.SET_MESSAGE_TOTAL_NUM(messageNum)
				// console.log(this.overallMessage.messageMap)
			}
		}
	},
	watch: {
		$route(to, from) {
			let token = localStorage.getItem("token") || "";
			      if (token) {
			        // firebase returns null if user logged out
			        this.isLoggedIn = true;
			      } else {
			        this.isLoggedIn = false;
			      }
			
		    }
	    // 使用watch 监听$router的变化
	  //   $route (to, from) {
			// if(to.path != '/' && to.path != '/home'){
			// 	// 如果to索引大于from索引,判断为前进状态,反之则为后退状态
			// 	console.log(to.meta.index)
			// 	console.log(from.meta.index)
			// 	if (to.meta.index > from.meta.index){
			// 	  // 设置动画名称
			// 	  this.transitionName = 'slide-left';
			// 	} else{
			// 		console.log('右边...')
			// 	  this.transitionName = 'slide-right';
			// 	}
			// }else{
			// 	this.transitionName = ''
			// }
		  
	      
	  //   }
	  }
}
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;	
  background:white;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f4f4f4;
}
p{
  margin: 0;
}
.bcBlack{
  // background:#000
}

.tab-wrap{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
