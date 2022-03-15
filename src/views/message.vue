<template>
	<v-touch  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
  <div>
	  <van-sticky>
	  	<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title="消息"  @click="returnPage">
	  		<van-icon
	  		    slot="right-icon"
	  		    name="wap-home-o"
	  			size="1.2rem"
	  		    style="line-height: inherit;"
	  			@click.stop="$router.push('/')"
	  		  />
	  	</van-cell>
	  </van-sticky>
<!-- 	  <van-sticky :offset-top="windowHeight*0.85" style="position:absolute">
	  	<van-button type="default"  style="width:100%" @click="userListView = true">用户列表</van-button>
	  </van-sticky> -->
    <div class="categorytab">
		<back-top :showHeight="300"></back-top>
      <!-- <van-tabs v-model="active" swipeable sticky animated offset-top=""> -->
        <!-- <van-tab v-for="(item,index) in category" scrollspy :key="index" :title="(item.DICT_NAME == '演员' ? '视频' : item.DICT_NAME)" scrollspy > -->
			<!-- 嵌套一层div做内容滚动区域, 一定要有确定高度，可以使用高度100%或calc(100vh - ?px) -->
			<div  :ref="'pageScroll'"  >
		<!-- <div style="height: calc(100vh - 10vh); overflow: auto;-webkit-overflow-scrolling: touch;" :ref="'pageScroll'" > -->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			  <div role="feed" class="van-list" :style="'height:'+windowHeight+'px;background:white'">
			  	<div class="detailparent">
			  		<div class="van-swipe-cell" style="width: 100%;" v-for="(categoryitem,categoryindex) in messageList()" @click="toPage(categoryitem)" :key="categoryindex">
			  			<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
			  				<div class="goods-card van-card" style="border-bottom: 1px solid rgb(235, 237, 240);">
			  					<div class="van-card__header">
			  						<a class="van-card__thumb">
			  							<div class="van-image" style="width: 100%; height: 100%;">
											<img src="@/assets/mzzj120.png" style="height:40px;width:40px" alt=""  v-if="categoryitem.source_user_name == '系统通知'">
											<van-image ref="workImage"  lazy-load :src="baseURL + categoryitem.icon +'&token=' + token" style="width:100%;width:45px" v-if="categoryitem.icon"/>
											<img src="@/assets/default_img.jpg" style="height:40px;width:40px" alt=""  v-if="categoryitem.source_user_name != '系统通知' && !categoryitem.icon">
			  							</div>
			  							<div class="van-info"></div>
			  						</a>
									
			  						<div class="van-card__content ">
										<div class="van-card__tag">
											<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex < 3" style="background:#ee0a24;color:#FEFFFF;border-radius:16px;" v-if="categoryitem.noReadNum">
												{{categoryitem.noReadNum}}
											</span>
										</div>
			  							<div>
											
			  								<div class="van-card__title van-multi-ellipsis--l2">
			  									{{categoryitem.source_user_name}}
			  								</div>
											<!-- <div style="position: absolute; right: 0;bottom: 1.5rem;"> -->
							<!-- 				<span class="van-tag van-tag--plain van-tag--danger" style="margin-right: 5px;border: 1px solid red;">
											            标签
											 </span> -->
											 <!-- </div> -->
											<div class="van-card__type2 van-ellipsis" style="width:65%;text-align:left;">
												{{categoryitem.messageContent ? categoryitem.messageContent : '暂无消息'}}
											</div>
											<div class="van-card__desc van-ellipsis " style="top:2rem">
												{{categoryitem | filterTime}}
											</div>
											
			  							</div>
			  							<div class="van-card__bottom">
			  								<div class="van-card__price" style="
			  								/* position: absolute; */
			  								/* left: 0; */
			  								">
			  									<!-- <div>
			  										<span class="van-card__price-currency">
			  										</span>
			  										<span class="van-card__price-integer" style="
			  										left: 1rem;
			  										">
			  											{{categoryitem.flowNum}}
			  										</span>
			  										<span class="van-card__price-decimal">
			  										</span>
			  									</div> -->
			  								</div>
			  							</div>
			  						</div>
			  					</div>
			  				</div>
			  			</div>
			  		</div>
			  	</div>
			  	<div class="van-list__placeholder">
			  	</div>
			  </div>
			<!-- </van-list> -->
          </van-pull-refresh>
		  </div>
        <!-- </van-tab> -->
      <!-- </van-tabs> -->
    </div>
	<van-tabbar
	  v-model="tabActive"
	  active-color="black"
	  inactive-color="black"
	>
	  <van-tabbar-item icon="friends-o"  @click="userListView = true">用户</van-tabbar-item>
	  
	 
	</van-tabbar>
  </div>
  <van-popup
  	  style="background: white;
  				opacity: 1;"
  	    v-model="userListView"
  	    position="bottom"
  	    :style="{ height: '65%' }"
  		@open="openUserView"
  	  >
	  <div style="height:4rem;margin-top:1rem;">
		  用户
		  <van-divider />
	  </div>
		<div class="detailparent">
			<div class="van-swipe-cell" style="width: 100%;" v-for="(categoryitem,categoryindex) in userList" @click="toPage(categoryitem)" :key="categoryindex">
				<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
					<div class="goods-card van-card" style="border-bottom: 1px solid rgb(235, 237, 240);">
						<div class="van-card__header">
							<a class="van-card__thumb">
								<div class="van-image" style="width: 100%; height: 100%;">
									<van-image ref="workImage"  lazy-load :src="baseURL + '/common/image?imgId=' + categoryitem.icon +'&token=' + token" style="width:100%;width:45px" v-if="categoryitem.icon"/>
									<img src="@/assets/default_img.jpg" style="height:40px;width:40px" alt=""  v-if="!categoryitem.icon">
								</div>
								<div class="van-info"></div>
							</a>
							
							<div class="van-card__content ">
								<div>
									
									<div class="van-card__title van-multi-ellipsis--l2">
										{{categoryitem.nickName}}
									</div>
									<!-- 在线状态 -->
									<div class="van-card__desc van-ellipsis " style="top:.2rem">
										
										<span v-if="categoryitem.active == 1" style="color:green">在线</span>
										<span v-if="categoryitem.active != 1">离线</span>
									</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  </van-popup>
</v-touch>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import backTop from '@/components/backTop'
import { mapGetters, mapMutations } from 'vuex'
import {formatTime} from '@/common/js/util.js'
export default {
	data() {
    return {
	  tabActive:0,// 底部菜单
	  userList:[],// 用户信息
      category: [],
	  userListView:false,// 用户列表显示控制
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  token: 'Bearer ' + localStorage.token,
	  // curScroll:{} // 滚动位置
    };
  },
  components: {
    NavBar,
	backTop
  },
  activated() {
	  this.userListView = false
	  console.log('显示了.....' + this.userListView)
    // if(localStorage.getItem('newCat')) {
    //     let newCat = JSON.parse(localStorage.getItem('newCat'))
    //     this.category = this.changeCategory(newCat)
    //     this.selectArticle();
    // }
	// 定位到之前位置
	this.toBeforeScroll();
  },
  
  // 不显示......
  // deactivated(){
	 //  console.log('不显示......')
	 //  // 
  // },
  filters:{
  	filterTime(data) {
		let val = data.lastTime
  	  if(val && val.time){
		  return formatTime(val.time)
		//   console.log(val)
  // 	    // return val.split('T')[0]
		// // return val.substring(0,10)
		// return (1900 + val.year) + '-' + (val.month + 1) + '-' + (val.day) + ' ' +  val.hours + ':' + val.minutes
  	  }
  	  return "";
  	},
	filterFlowNum(val){
		val = val + ''
		// if(val < 100){
		// 	return val;
		// }
		// if(val > 100){
		// 	return val.substring(0,1) + '百+'
		// }
		// if(val > 1000  && val< 10000){
		// 	return val.substring(0,1) + '千+'
		// }
		// if(val > 10000 && val < 100000){
		// 	return val.substring(0,1) + '万+'
		// }
		if(val > 100000 && val < 1000000){
			return val.substring(0,1) + '百万+'
		}
		return val
	}
  },
  methods: {
	  // 打开用户列表窗口
	  async openUserView(){
		  const res = await this.$http.get('/admin/queryNotCurUserInfo')
		  console.log(res)
		  if(res.data.code == 200){
			  this.userList = res.data.data
		  }
	  },
	  onSwipeLeft () {
	  
	  },
	  onSwipeRight(){
		  console.log('滑动......')
	  	if(localStorage.slideReturn == 1){
	  		this.$router.go(-1)
	  	}
	  },
	  ...mapGetters([
	  	'messageList'
	  ]),
	  returnPage(){
	  	this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  	this.$router.go(-1)
	  },
	  // 图片加载结束
	  imgLoad(e){
		if(this.$refs['workImage'][e]){
			this.$refs['workImage'][e].$refs.image.style.objectPosition = 'top';
		}
	  },
	recordScroll(){
	  let pageScroll = this.$refs['pageScroll']
	  // console.log(pageScroll)
	  if(pageScroll){
		  for(let i =0;i<pageScroll.length;i++){
			  this.pageScroll[this.name + 'pageScroll_'+i] = pageScroll[i].scrollTop
		  }
		  // console.log(this.curScroll)
	  }
	},
	// 之前滚动位置跳转
	toBeforeScroll(){
	  let pageScroll = this.$refs['pageScroll']
	  // console.log('跳转.....')
	  // console.log(pageScroll)
	  // console.log(this.curScroll)
	  if(pageScroll){
		  for(let i =0;i<pageScroll.length;i++){
			  pageScroll[i].scrollTop = this.pageScroll[this.name + 'pageScroll_'+ i]
		  }
	  }
	},
    onScroll(){
      
    },
	toPage(item){
		console.log(item)
		// 记录当前位置
		this.recordScroll();
		//this.$msg.fail('功能开发中')
		// 清除查询状态
		// this.overallMessage.messageMap.get(item.user_id).noReadNum = 0
		this.userListView = false;
		console.log('关闭了啊' + this.userListView)

		// 跳转明细页面、携带用户id和页面标识
		this.$router.push(`/messageDetail/${item.messageSource}/${item.user_id}`)
		
		// 视频页面
		// if(detailitem.loadMode == 4){
		//   if(this.$route.path != `/article/${detailitem.id}/${detailitem.loadMode}`) {
		//       this.$router.push(`/article/${detailitem.id}/${detailitem.loadMode}`)
		//   }
		// }
		// // 漫画页面
		// if(detailitem.loadMode == 2){
		//   // alert('漫画')
		//     this.$router.push(`/manga/${detailitem.id}`)
		// }
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      // console.log(res)
      // const menu = [{DICT_NAME:'消息'},{DICT_NAME:'视频'},{DICT_NAME:'漫画'}]
	  // const res = await this.$http.get("/webInfoDetailData/queryMenu",{timeout:this.httpTimeout});
	  // // console.log(res)
	  let menu = [{
		  CODE_VALUE:'ZXPL',
		  DICT_NAME:'最新评论',
	  }]
      this.category = this.changeCategory(menu);
	  // console.log(this.category)
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 20;
        return item;
      });
      return category1;
    },
    async selectArticle() {
      const categoryitem = this.categoryItem();
	  // console.log(categoryitem)
	  // const res = await this.$http.post('/webInfoDetailData/queryWebDataHot',{
		 //  loadMode: categoryitem.DICT_NAME == '演员' ? 4 : categoryitem.pageMode,
		 //  pageNum: categoryitem.page,
		 //  pageSize: categoryitem.pagesize,
	  // },{timeout:10000})
	  // console.log(res)
	// const res = await this.$http.post("/message/queryTypeMessage", {
 //          // typeId: categoryitem.CODE_VALUE,
 //          pageNum: categoryitem.page,
 //          pageSize: categoryitem.pagesize,
 //          // : ''
 //        })
		
  //       if(res.data.data.list == 0){
          categoryitem.finished = true;
  //         return
  //       }
  //       categoryitem.list.push(...res.data.data.list);
		// categoryitem.loading = false;
		// if (res.data.length < categoryitem.pagesize) {
		//   categoryitem.loading = true;
		//   categoryitem.finished = true;
		// }

    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    // this.list = []
                    let categoryitem = this.categoryItem();
                    categoryitem.page = 1;
                    categoryitem.list = []
					categoryitem.finished = false;
                    this.selectArticle();
                }, 500);
            },
    onLoad() {
      const categoryitem = this.categoryItem();
	  // console.log(categoryitem)
	  if(categoryitem.list.length == 0){
		  categoryitem.finished = true
	  }
      setTimeout(() => {
        categoryitem.page += 1;
        this.selectArticle();
      }, 1000);
    },
    categoryItem() {
      const categoryitem = this.category[this.active];
      // console.log(categoryitem)
      return categoryitem;
    },

  },
  // activated() {
  // 		// 页面显示了,去更新各类消息信息
  		
  //     const categoryitem = this.categoryItem();
  // 	  console.log(categoryitem)
	 //  for(let i =0;i<categoryitem.list.length;i++){
		//   // 更新各类消息数量
		//   // categoryitem.list[i].noReadNum = this.overallMessage.messageMap.get(categoryitem.list[i].user_id).noReadNum
	 //  }
  // //     if (!categoryitem.list.length) {
  // //       this.selectArticle();
  		
  // //       // this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
  // //     }
  //   },
  watch: {

	$route(to,from) {
		// console.log(to)
		// 跳转高度
		if(to.name == 'message'){
			// alert(this.currentScroll)
			this.$nextTick(()=>{
				document.documentElement.scrollTop = this.currentScroll
				document.body.scrollTop = this.currentScroll
			})
		}
		
		// id不同刷新
		// if(to.name =='message'){
		// 	console.log('数据刷新...')
		// 	this.selectCategory();
		// 	// this.$forceUpdate()
		// 	// scroll(0,0)
		// 	// this.loadMode = 0
		// 	// this.person = {}
		// 	// const categoryitem = this.categoryItem();
		// 	// categoryitem.list = []
		// 	// categoryitem.page = 1
		// 	// categoryitem.finished = false;
		// 	// categoryitem.loading = true;
		// 	// this.selectArticle();
		// 	// this.collectionInit()
		// }
	},
	// '$parent.tabActive'(){
	// 	console.log('===============================')
	// }
  },
  created() {
	  // this.$msg({
		 //  position:'top',
		 //  message:'11111',
		 //  type:'html'
	  // })
	 //  this.$dialog.alert({
	 //    title: '提示',
	 //    message: '确定退出吗？',
		// // lock-scroll:true,
	 //  })
	  
	  if(!this.websocket){
		 this.createWebSocket()
	  }
      this.selectCategory();
  }
};
</script>

<style lang="less" scoped>
.detailparent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .detailitem {
    margin: 1.389vw 0;
    width: 45%;
  }
}
.categorytab{
  position: relative;
  .category-ico{
    position: absolute;
    z-index: 5;
    right: 0;
    top: 1.944vw;
    padding: 1.389vw 2.778vw;
    background-color: #ee0a24;
  }
}

/deep/ .van-card{
	position: relative;
	    box-sizing: border-box;
	    padding: 8px 16px;
	    color: #323233;
	    font-size: 12px;
	    background-color: white;
}

.van-card__desc{
	position: absolute;
	right: 0;
	bottom: 0;
}
.van-card__more{
	position: absolute;
	right: 0;
	bottom: 0;
}
/deep/ .van-card__header{
	display: flex;
	height:4rem;
}
/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    height: 4rem;
	    margin-right: 8px;
}

.van-card__num{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 0;
}
/deep/ .van-card__title {
    max-height: 32px;
    font-weight: 500;
    line-height: 16px;
	// left:1rem;
	text-align: initial;
	position: absolute;
	font-size: 16px;
	    font-weight: 600;
	    top: 0.4rem;
	    left: 1.2rem;
		letter-spacing:1px;
}

/deep/ .van-card__type2{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 2.5rem;
		//right: 0;
		top: 2rem;
		    left: 1.2rem;
			letter-spacing:1px;
}
.van-card__chat{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
	left: 3.5rem; 
	bottom: 0;
}
/deep/ .van-card__thumb img{
	border-radius:30px;
}

/deep/ .van-swipe-cell{
	height:4rem;
}

/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    height: 88px;
	    margin-right: 8px;
}

/deep/ .van-card__content{
	height:4rem;
}

.van-info{
	position: absolute;
	    top: 0;
	    right: 0;
	    box-sizing: border-box;
	    min-width: 16px;
	    padding: 0 3px;
	    color: #fff;
	    font-weight: 500;
	    font-size: 12px;
	    font-family: -apple-system-font,Helvetica Neue,Arial,sans-serif;
	    line-height: 1.2;
	    text-align: center;
	    background-color: #ee0a24;
	    border: 1px solid #fff;
	    border-radius: 16px;
	    -webkit-transform: translate(50%,-50%);
	    transform: translate(50%,-50%);
	    -webkit-transform-origin: 100%;
	    transform-origin: 100%;
}

/deep/ .van-card__tag{
	position: absolute;
	    top: 2px;
	    left: -1rem;
}
</style>