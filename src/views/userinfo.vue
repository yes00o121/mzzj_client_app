<template>
		<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div class="userinfo">
      <!-- <nav-bar/> -->
      <img src="@/assets/bannerTop_new.png" alt="" class="backImg">
      <user-detail :userInfo="model"/>
      <user-article />
  </div>
  </v-touch>
</template>

<script>
import NavBar from '@/components/common/Navbar.vue'
import userDetail from '@/components/userComponent/userDetail'
import userArticle from '@/components/userComponent/userArticle'
export default {
    data() {
        return {
            model:{}
        }
    },
    components:{
        NavBar,
        userDetail,
        userArticle
    },
    methods:{
		onSwipeLeft () {
		    // console.log('页面左滑')
		  // this.$router.go(-1)
		},
		onSwipeRight(){
		    // console.log('页面右滑')
		    this.$router.go(-1)
		},
        async userData() {
            // const res =  await this.$http.get('/user/' + localStorage.getItem('id'))
            this.getUser().then(response=>{
              this.model = response.data.data
            })
            // this.model = res.data[0]
        }
    },
    created() {
        this.userData()
    }
}
</script>

<style lang="less">
.userinfo{
.backImg{
    height: 91px;
    width: 100%;
}
}
</style>
