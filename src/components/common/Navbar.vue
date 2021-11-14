<template>
  <div class="NavBar">
      <div>
          <img src="@/assets/mzzj120.png" style="height:40px;width:40px" alt="" @click="$router.push('/')">
		  <span style="font-size:12px">漫宅之家</span>
      </div>
<!-- 	  <div>
		  <div><van-icon name="search" class="iconNav"/></div>
	  </div> -->
      <div @click="toSearch()">
          <div> <van-icon name="search"  class="iconNav"/></div>
      </div>
      <div>
         <!-- <img style="border-radius:50%" :src="imgUrl" alt="" @click="$router.push('/userinfo')" v-if="imgUrl">
          <img style="border-radius:50%" src="@/assets/default_img.jpg" alt="" @click="$router.push('/userinfo')"  v-else> -->
		  <!-- <img style="border-radius:50%" :src="imgUrl" alt=""  v-if="imgUrl"> -->
		  <!-- <img style="border-radius:50%" src="@/assets/default_img.jpg" alt=""   v-else> -->
		  <van-icon name="search" size="1.5rem" @click="$router.push('/magnet')"/>
		  <van-icon name="video-o" size="1.5rem" @click="$router.push('/video')"/>
          <!-- <div>下载App</div> -->
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // userInfo:null
            imgUrl:'',
			random:0,// 随机数,每次切换头部都生成
        }
    },
	activated(){
		this.random = this.getRandom()
	},
    methods:{
		toSearch(){
			this.$router.push('/search?random=' + this.random);
		},
		getRandom(){
			return Math.random()
		},
        async NavInit() {
          this.getUser().then(response=>{
            if(response.data.data.icon){
              this.imgUrl = this.baseURL + '/common/image?imgId=' + response.data.data.icon
            }

          })
            // if(localStorage.getItem('token')){
            // const res = await this.$http.get('/admin/info')
            // // const res = await this.$http.get('/user/' + localStorage.getItem('id'))
            // // this.imgUrl = res.data[0].user_img
            // }
        },
		// toSearch(){
		// 	console.log('...............')
		// 	// 跳转搜索页面
		// 	this.$route.push('/search')
		// }
    },
    mounted() {
        this.NavInit()
    },
}
</script>

<style scoped lang="less">
.NavBar{
    // height: 13.056vw;
    display: flex;
    background-color: white;
    div:nth-child(1){
        width: 25vw;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            width:100%;
        }
    }
    div:nth-child(2){
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 1.389vw;
        div{
            background-color: #f4f4f4;
            height: 6.667vw;
            width: 100%;
            border-radius: 3.333vw;
              position: relative;
              .iconNav{
                  color: #aaa;
                  position: absolute;
                  left: 2.778vw;
                  top: 50%;
                  transform: translate(0,-50%);
            }
     }
    }
    div:nth-child(3){
        display: flex;
        justify-content: center;
        align-items: center;

        >div{
            margin: 0 2.778vw;
            font-size: 3.611vw;
            background-color: #fb7299;
            padding: 1.389vw 2.778vw;
            text-align: center;
            border-radius: 0.833vw;
            color: white;

        }
        img{
            width: 6.944vw;
            height: 6.944vw;
        }
    }
}
</style>
