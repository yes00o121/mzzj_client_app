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
	  </div>
</template>

<script>
export default{
	name:'catch_components',
	data(){
		return {
			isLoggedIn:false, // 控制退出清除会话
			transitionName:'',
			websocket:null // websocket
		}
	},
	created(){
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
						  console.log(this.dynamicNum)
						  if(this.dynamicNum == null){
							this.dynamicNum = 1
						  } else {
							this.dynamicNum += 1;
						  }
						   console.log(this.dynamicNum)
				})
				//连接响应
				this.websocket.onopen = function(){
				  console.log('websocket连接达成');
				}
				this.websocket.onerror = function(){
				  console.log('websocket错误');
				}
				window.onbeforeunload = ()=>{
				   if(this.websocket != null){
					   this.websocket.close();
				   }
				}
			}
			
		}
		
	},
	mounted(){

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
