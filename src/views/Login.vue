<template>
	<div>
	  <div v-if="powerPassword">
		  <login-top Text="登录漫宅之家">
				<!-- <div slot="right" style="font-size:3.611vw" @click="$router.push('/register')">用户注册</div> -->
		  </login-top>

			<login-text label="账号"
			placeholder="请输入账号"
			 @contentWatch="res => model.username = res"
			 style="margin:4.167vw 0"
			 >
			</login-text>

		   <!-- <login-text label="密码"
				placeholder="请输入密码"
				type="password"
				@contentWatch="res => model.password = res"
			>
			</login-text> -->

			<login-btn BtnText="登录" @TextClick="AjaxInsert"></login-btn>
			<div v-if="uuidShow">{{uuid}}</div>
			<!-- <video id="video-container" controls="true"></video> -->
	  </div>
	  <div v-if="!powerPassword">
		  <login-top Text="请输入开机密码">
						
		  </login-top>
			<div >
				<login-text label="密码"
				placeholder="请输入开机密码"
				 @contentWatch="res => powerObj.kjmm = res"
				 style="margin:4.167vw 0"
				 >
				</login-text>
				<login-btn BtnText="开机" @TextClick="openSystem"></login-btn>
			</div>
		</div>
  </div>

</template>

<script>
import LoginTop from '@/components/common/LoginTop.vue'
import LoginText from '@/components/common/LoginText.vue'
import LoginBtn from '@/components/common/LoginBtn.vue'
import { mapGetters, mapMutations } from 'vuex'
import md5 from 'js-md5';
export default {
    data() {
        return {
			uuid:localStorage.uuid,
			uuidShow:false,
            model:{},
			powerObj:{},
			powerPassword:true,
        }
    },
    components:{
        LoginTop,
        LoginText,
        LoginBtn
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
		openSystem(){
			if(this.powerObj.kjmm){
				let _this = this
				// 请求,如果返回错误404说明连接正常
				// let url = ''
				// if(this.powerObj.kjmm == 'test'){
				// 	url = 'http://192.168.31.196:8115'
				// }else{
				// 	url = 'http://'+ _this.powerObj.kjmm +'.cpolar.cn'
				// }
				this.$http.post('/mzzjcontroller/login/verificationSystemPassword',{
					kjmm: md5(this.powerObj.kjmm)
				},{timeout:this.httpTimeout}).then(res=>{
					console.log(res)
					if(res.data.code == 200){
						_this.powerPassword = true
						// localStorage.setItem('address',url)
					}else{
						_this.$msg.fail(res.data.message)
					}
				})
				// $.ajax({
				// 	url:url,
				// 	success:function(res){

				// 	},error:function(res){
				// 		if(res.status == 404){
				// 			_this.powerPassword = true
				// 			localStorage.setItem('address',url)
				// 		}else{
				// 			_this.$msg.fail('密码错误,请重新输入!')
				// 		}
				// 	}
				// })
			}else{
				_this.$msg.fail('请输入开机密码!')
			}
			// if(localStorage.getItem('address')){
			// 	this.powerPassword = true
			// 	let url = "http://4a10afaf.cpolar.cn";
			// 	console.log('222')
			// }else{
				
			// }
			
		},
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
		},
        async AjaxInsert() {
			if(!this.model.username){
				this.$msg.fail('请输入账号!')
				return
			}
			// 神秘代码，显示uuid
			if(this.model.username == '漫宅之家'){
				this.uuidShow = true
				return
			}
            let rulg = /^.{3,16}$/
            if(rulg.test(this.model.username)/*&&rulg.test(this.model.password)*/){
				this.$msg.loading({
				  message: '登录中...',
				  forbidClick: true,
				  duration:0
				});
				// return;
                const res =  await this.$http.post('/login/loginverification',this.model,{timeout:this.httpTimeout})
				// this.$msg.clear()
                if(res.data.code == 404 || res.data.code == 401){
					this.$msg.fail(res.data.message)
					return
                }
				// console.log(res.data.data.token)
                localStorage.setItem('token',res.data.data.token)
                // localStorage.setItem('id',res.data.userinfo.id)
				this.$msg.success();
                setTimeout(() => {
                    // this.$router.push('/userinfo')
				// 创建websocket连接
				// this.createWebSocket()
					// 登陆成功跳转首页
					this.$router.push('/home')
                },1000)
            }else{
                this.$msg.fail('格式不正确,请重新输入!')
            }
        }
    },
    created(){
		// 判断是否输入开机密码
		// if(localStorage.getItem('address') == null){
		// 	this.powerPassword = false
		// }else{
		// 	this.powerPassword = true
		// }
		// if(this.powerPassword){
		// 	// 判断用户是否登陆,登陆跳转首页
		// 	const token = localStorage.getItem('token')
		// 	if(token){
		// 	  this.$router.push('/home')
		// 	}
		// }
		
		console.log('222211')
		
		// const WebTorrent = require('webtorrent')
		
		// const client = new WebTorrent()
		// const magnetURI = 'magnet:?xt=urn:btih:8EFBFDB1F395F54B0A72CCECE349E8E6F2BD4EA7&dn=SSIS-349'
		
		// client.add(magnetURI, function (torrent) {
		//   // Got torrent metadata!
		//   console.log('Client is downloading:', torrent.infoHash)
		
		//   torrent.files.forEach(function (file) {
		// 	  console.log('ffff')
		//     // Display the file by appending it to the DOM. Supports video, audio, images, and
		//     // more. Specify a container element (CSS selector or reference to DOM node).
		//     file.appendTo('body')
		//   })
		// })
		
		
		
		

    }
}
</script>

<style>

</style>
