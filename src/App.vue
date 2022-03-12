<template>

	  <div id="app" >
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
			// height:'0px',
			// isShow:false,
			token: 'Bearer ' + localStorage.token,
			isLoggedIn:false, // 控制退出清除会话
			transitionName:'',
			websocket:null // websocket
		}
	},

	created(){
		let _this = this;
		// 判断当前设置,如果是电脑禁止访问
		if(navigator.appVersion.indexOf('Mobile') == -1){
			this.equipmentCheck = true
		}else{
				  this.equipmentCheck = false
		    if(localStorage.getItem('token')){
				
				// 建立websocket连接
				let websocketUrl = this.baseURL.replace('http','ws') + '/websocket?token=' + localStorage.getItem('token')
				// let websocketUrl = 'ws://192.168.1.113:8095/websocket?token='
				this.websocket = new WebSocket(websocketUrl);
				
				this.websocket.onclose=function(){//连接关闭监听
					console.log('websocket连接关闭');
				}
				this.websocket.onmessage = (event=>{
						  //接收消息方法
						  console.log(event)
						  console.log('websocket接收消息');
						 //  console.log(this.dynamicNum)
						 //  if(this.dynamicNum == null){
							// this.dynamicNum = 1
						 //  } else {
							// this.dynamicNum += 1;
						 //  }
						   // console.log(this.dynamicNum)
						   let data = JSON.parse(event.data) // 接收消息
						   // 判断消息类型
						   if(data.msgType == 'STATISTICS'){
							   // 统计消息,将消息写入localStorage该类统计实时各类消息情况
							   console.log('统计消息....')
							   // localStorage.setItem('statistics',event.data)
							   // 统计消息数量
							   _this.initMessage(data);
						   }else if(data.msgType == 'COMMENT'){
							   // console.log('消息数量....' +this.overallMessage.messageMap.get(data.message.user_id).noReadNum )
							   // this.overallMessage.messageMap.get(data.message.user_id).noReadNum +=1;
							   // console.log(this.overallMessage.messageMap.get(data.message.user_id))
							   
							   console.log(data)
							   // 判断是否在消息页面,在消息页面直接追加数据,否则弹出窗口
							   console.log(_this.$route)
							   if(_this.$route.name == 'messageDetail'){
								   console.log(_this)
								   // 获取到消息页面,推送消息过去
								   for(let i = 0;i<_this.$children.length;i++){
									   if(_this.$children[i].name == 'messageDetail'){
										   console.log('在消息页面')
										   _this.$children[i].getWebSocketMessage(data);
									   }else{
										   console.log('不在消息页面')
									   }
								   }
								   // this.websocket_message = data
							   }else{
								   // 更新消息数量
								   // _this.messageMap().get(data.message.user_id).noReadNum = _this.messageMap().get(data.message.user_id).noReadNum + 1
								   // _this.GET_MESSAGE_LIST(data.message.user_id).noReadNum = _this.GET_MESSAGE_LIST(data.message.user_id).noReadNum + 1
								   // console.log(_this.$store.messageList)
								   // top.a = _this.$store
								   let messageTotalNum = 0
								   // 消息总数更新
								   // alert(_this.messageTotalNum)
								   // if(_this.messageTotalNum != '99+'){
									   // _this.messageMap().forEach((v,k)=>{
										  //  messageTotalNum = messageTotalNum + (v.noReadNum ? v.noReadNum : 0)
									   // })
								   for(let i =0;i<_this.$store.getters.messageList.length;i++){
									   messageTotalNum = messageTotalNum + (_this.$store.getters.messageList[i].noReadNum ? _this.$store.getters.messageList[i].noReadNum : 0)

									   if(data.message.user_id == _this.$store.getters.messageList[i].user_id){
										   if(_this.$store.getters.messageList[i].noReadNum > 99){
											   _this.$store.getters.messageList[i].noReadNum = '99+'
										   }else{
											   _this.$store.getters.messageList[i].noReadNum = _this.$store.getters.messageList[i].noReadNum + 1
										   }
									   }
								   }
								   console.log(_this.$store.getters.messageTotalNum)
								   if(_this.$store.getters.messageTotalNum != '99+'){
										_this.SET_MESSAGE_TOTAL_NUM(messageTotalNum)		   
								   }else{
									   _this.SET_MESSAGE_TOTAL_NUM('99+')
								   }
								   // }
								   
								   // 评论消息,弹出提示窗口
								   _this.$notify({
								   	message: data.title + '\n' + data.message.content,
								   	  duration: 2000,
								   	  type: 'success'
								   })
							   }

						   }

				})
				//连接响应
				this.websocket.onopen = function(){
				  console.log('websocket连接达成');
				  // 达成的时候将未读的消息记录下来
					// _this.$notify({
					// 	message: '<div>1111111</div>薄荷七喜\n你有一条新消息',
					// 	  duration: 1000,
					// 	  // color: '#ad0000',
					// 	  type: 'success'
					// })
				}
				this.websocket.onerror = function(){
				  console.log('websocket错误');
				}
				window.onbeforeunload = ()=>{
					console.log('被关闭了......')
				   if(this.websocket != null){
					   this.websocket.close();
				   }
				}
			}
			
		}
		
	},
	mounted(){

	},
	methods:{
		...mapMutations([
			'SET_MESSAGE_TOTAL_NUM',
			'APPEND_MESSAGE_LIST',
			'GET_MESSAGE_LIST',
			
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
