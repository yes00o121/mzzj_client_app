<template>
		<!-- <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}"> -->
  <div class="userinfo" ref="pageScroll">
	  		<van-icon name="apps-o" size="1.5em" @click="openRightPop" style="position: absolute;
    top: 5px;
    right: 5px;
    font-size: 1.5em;" />
      <!-- <nav-bar/> -->
      <img src="@/assets/bannerTop_new.png" alt="" class="backImg">
      <user-detail :userInfo="model"/>
      <!-- <user-article ref="article" /> -->
	  <van-popup
	    get-container="#app"
	    v-model="show"
	    position="right"
	    :style="{ height: '100%', width: '45%' }"
	  >
	  		<van-cell icon="setting-o" value="设置" @click="toSet" >
				<van-icon
					    slot="right-icon"
					    name="arrow"
					    style="line-height: inherit;"
					  />
			</van-cell>
			<van-cell icon="close" value="退出" @click="exitSystem" >
				<van-icon
				    slot="right-icon"
				    name="arrow"
				    style="line-height: inherit;"
				  />
			</van-cell>
	</van-popup>
	<div>
		<van-tabbar v-model="active" :fixed = "false" :border="false" inactive-color="rgb(25, 137, 250)" >
			<van-tabbar-item icon="star-o" @click="pathPush(1)">收藏</van-tabbar-item>
		  <van-tabbar-item icon="clock-o" @click="pathPush(2)">历史记录</van-tabbar-item>
		  <van-tabbar-item icon="chat-o" :badge="messageNum" @click="pathPush(4)">消息</van-tabbar-item>
<!-- 		  <van-icon name="chat-o" badge="99+" /> -->
		  <van-tabbar-item icon="friends-o" v-if="root == 1" @click="pathPush(3)">用户日志</van-tabbar-item>
		</van-tabbar>
	</div>
  </div>
  
  <!-- </v-touch> -->
</template>

<script>
import NavBar from '@/components/common/Navbar.vue'
import userDetail from '@/components/userComponent/userDetail'
import userArticle from '@/components/userComponent/userArticle'
import app from '@/App.vue'
export default {
    data() {
        return {
            model:{},
			curScroll:{},
			show:false,
			active:-1,
			root:0,
			messageNum:null	
        }
    },
    components:{
        NavBar,
        userDetail,
        userArticle
    },
    methods:{
		pathPush(index) {
			// alert(index)
			if(index == 1){
				this.$router.push(`/collection`)
			}
			if(index == 2){
				this.$router.push(`/history`)
			}
			if(index == 3){
				this.$router.push(`/userlog`)
			}
			if(index == 4){
				this.$router.push(`/message`)
			}
			
		 //    const loadMode = `${this.detailitem.loadMode}`;
			// // 没有loadMode，走人员页面
			// if(loadMode == 'undefined'){
			// 	this.$router.push(`/person/${this.detailitem.id}/${this.detailitem.person_type}`)
			// }
		 //    // 视频页面
		 //    if(loadMode == 4 || loadMode == 6){
		 //      if(this.$route.path != `/article/${this.detailitem.id}/${this.detailitem.loadMode}`) {
		 //          this.$router.push(`/article/${this.detailitem.id}/${this.detailitem.loadMode}`)
		 //      }
		 //    }
		 //    // 漫画页面
		 //    if(loadMode == 2){
		 //      // alert('漫画')
		 //        this.$router.push(`/manga/${this.detailitem.id}`)
		 //    }
		
		},
		recordScroll(){
		  let pageScroll = this.$refs['pageScroll']
		  if(pageScroll){
			  this.curScroll['pageScroll'] = document.documentElement.scrollTop || document.body.scrollTop
		  }
		},
		// 之前滚动位置跳转
		toBeforeScroll(){
		  let pageScroll = this.$refs['pageScroll']
		  if(pageScroll){
			  pageScroll.scrollTop = this.curScroll['pageScroll']
		  }
		},
		// 退出系统
		exitSystem(){
			this.$dialog.confirm({
			  title: '提示',
			  message: '确定退出吗？'
			}).then(() => {
				// console.log('退出')
				localStorage.clear()
				// 清空页面缓存
				this.$router.push('/')
			}).catch(() => {
				// console.log('不退出')
			});
		},
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
    //         this.getUser().then(response=>{
				// console.log(response)
    //           this.model = response.data.data
    //         })
            // this.model = res.data[0]
        },
		async getUser(){
			const res = await this.$http.get('/admin/info')
			console.log(res.data.data)
			this.model = res.data.data
			if(this.model.username == 'yangchen'){
				this.root = 1
			}
		},
		async getUserConfig(){
			// 是否开启滑动返回
			const res = await this.$http.get('/admin/queryConfig?key=slide_return')
			localStorage.slideReturn = res.data.data
			// 是否开启置顶按钮
			const res1 = await this.$http.get('/admin/queryConfig?key=back_top')
			localStorage.back_top = res.data.data
		},
		// 加载消息数据
		async loadMessage(){
			const res = await this.$http.get("/message/queryMessageNum")
			console.log(res.data)
			if(res.data > 99){
				this.messageNum = '99+'
				// 底部"我的"菜单显示消息图标
				this.$parent.myIconStatus = true
			} else{
				if(res.data == 0){
					this.messageNum = null;
					console.log('........')
				}else{
					this.messageNum = res.data
					// 底部"我的"菜单显示消息图标
					this.$parent.myIconStatus = true
				}
				
			}
			console.log(this.messageNum)
			

		}
    },
    created() {
        // this.userData()
		this.getUser()
		this.getUserConfig()
		this.loadMessage();
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
		// if(this.curScroll > 0){
		// 	// alert(this.curScroll)
		// 	scroll(0,this.curScroll)
		// } else {
		// 	scroll(0,0)
		// }
		// 页面显示的时候关闭右侧面板
		this.show = false;
		// this.curScroll = 0 // 不是相同页面,重置高度
		// if(this.category.length == 0){
		// 	this.selectCategory();
		// }
	},
	watch:{
		// '$parent.tabActive'(cur){
		// 	// console.log(cur)
		// 	// alert(11)
		// 	  if(cur != 3){
		// 		  // 记录当前高度
		// 		  // this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// 		  // alert(this.curScroll)
		// 		  // alert(11)
		// 		  // alert('记录高度' + this.curScroll)
		// 	  }
		// 		// alert(111)  
		// },
	}
}
</script>

<style lang="less" scoped>
.userinfo{
	position: absolute;
	width: 100%;
.backImg{
    height: 91px;
    width: 100%;
}
}
.van-dialog__header{
	padding-top: 24px;
	font-weight: 500;
	line-height: 24px;
	text-align: center;
	color: black;
}
/deep/ .van-tabbar-item__text{
	color:black;
	margin-top: 0.3rem;
}
</style>
