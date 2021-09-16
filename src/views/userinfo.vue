<template>
		<!-- <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}"> -->
  <div class="userinfo">
	  		<van-icon name="apps-o" size="1.5em" @click="openRightPop" style="position: absolute;
    top: 5px;
    right: 5px;
    font-size: 1.5em;" />
      <!-- <nav-bar/> -->
      <img src="@/assets/bannerTop_new.png" alt="" class="backImg">
      <user-detail :userInfo="model"/>
      <user-article />
	  <van-popup
	    get-container="#app"
	    v-model="show"
	    position="right"
	    :style="{ height: '100%', width: '45%' }"
	  >
	  		<van-cell icon="setting-o" title="设置" is-link to="/set" />
	</van-popup>
  </div>
  
  <!-- </v-touch> -->
</template>

<script>
import NavBar from '@/components/common/Navbar.vue'
import userDetail from '@/components/userComponent/userDetail'
import userArticle from '@/components/userComponent/userArticle'
export default {
    data() {
        return {
            model:{},
			curScroll:0,
			show:false
        }
    },
    components:{
        NavBar,
        userDetail,
        userArticle
    },
    methods:{
		// 打开右侧窗口
		openRightPop(){
			this.show = true
		},
		toSet(){
			this.$router.push('/set')
		},
		onSwipeLeft () {
		    // console.log('页面左滑')
		  // this.$router.go(-1)
		},
		onSwipeRight(){
		    // console.log('页面右滑')
		    // this.$router.go(-1)
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
		// top.a = this
    },
	activated() {
		  // alert('dangqiangaodu....' + this.curScroll)
	  // if(localStorage.getItem('newCat')) {
	  //     let newCat = JSON.parse(localStorage.getItem('newCat'))
	  //     this.category = this.changeCategory(newCat)
	  //     this.selectArticle();
	  // }
		// top.a = this
		// console.log(this.$parent)
		// alert('回来高度' + this.curScroll)
		if(this.curScroll > 0){
			// alert(this.curScroll)
			scroll(0,this.curScroll)
		} else {
			scroll(0,0)
		}
		// this.curScroll = 0 // 不是相同页面,重置高度
		// if(this.category.length == 0){
		// 	this.selectCategory();
		// }
	},
	watch:{
		'$parent.tabActive'(cur){
			// console.log(cur)
			// alert(11)
			  if(cur != 3){
				  // 记录当前高度
				  this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
				  // alert(this.curScroll)
				  // alert(11)
				  // alert('记录高度' + this.curScroll)
			  }
				// alert(111)  
		},
	}
}
</script>

<style lang="less">
.userinfo{
	position: absolute;
.backImg{
    height: 91px;
    width: 100%;
}
}
</style>
