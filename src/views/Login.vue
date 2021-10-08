<template>
  <div>
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
		
  </div>
</template>

<script>
import LoginTop from '@/components/common/LoginTop.vue'
import LoginText from '@/components/common/LoginText.vue'
import LoginBtn from '@/components/common/LoginBtn.vue'
export default {
    data() {
        return {
			uuid:localStorage.uuid,
			uuidShow:false,
            model:{}
        }
    },
    components:{
        LoginTop,
        LoginText,
        LoginBtn
    },
    methods:{
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
                const res =  await this.$http.post('/admin/login',this.model,{timeout:this.httpTimeout})
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
					this.$router.push('/home')
                },1000)
            }else{
                this.$msg.fail('格式不正确,请重新输入!')
            }
        }
    },
    created(){
      // 判断用户是否登陆,登陆跳转首页
      const token = localStorage.getItem('token')
      if(token){
        this.$router.push('/home')
      }
    }
}
</script>

<style>

</style>
