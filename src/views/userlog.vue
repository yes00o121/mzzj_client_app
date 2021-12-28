<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;width:100%" :swipe-options="{direction: 'horizontal'}">
		<van-sticky >
			<van-cell  style="z-index:99999;"  icon="arrow-left" title="用户日志"  @click="returnPage">
				<van-icon
					slot="right-icon"
					name="wap-home-o"
					size="1.2rem"
					style="line-height: inherit;"
					@click.stop="$router.push('/')"
				  />
			</van-cell>
		</van-sticky>


		<!-- <van-panel :title="item.nick_name" :desc="''" status="状态" v-for="item in userLoginArr">

		</van-panel> -->
		<van-collapse v-model="activeName" accordion>
		  <van-collapse-item :title="item.nick_name" :name="index"  v-for="(item,index) in userLoginArr">
			  <van-cell-group>
			    <van-cell title="最后请求时间" :value="item.lastTime | filterTime" />
				<van-cell title="最后登录时间" :value="item.create_time | filterTime" />
				<van-cell title="登录设备" :value="item.os" />
				<van-cell title="登录ip" :value="item.ip " />
			    <!-- <van-cell title="单元格" value="内容" label="描述信息" /> -->
			  </van-cell-group>
		  </van-collapse-item>
		  <!-- <van-collapse-item title="标题2" name="2">内容</van-collapse-item> -->
		  <!-- <van-collapse-item title="标题3" name="3">内容</van-collapse-item> -->
		</van-collapse>

</v-touch>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
// import backTop from '@/components/backTop'
export default {
  data() {
    return {
		activeName: ['1'],
		loading:false,
		finished:false,
      category: [],
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  token: 'Bearer ' + localStorage.token,
	  // currentScroll:0,
	  option1: [
	    { text: '全部类型', value: 0 },
	    { text: '漫画', value: 2 },
	    { text: '视频', value: 4 },
		{ text: '演员', value: 6 },
		{ text: '作品', value: 7 },
		// { text: '作品', value: 3 }
	  ],
	  // value1: 0,
	  loadMode:0,
	  curScroll:{},
	  userLoginArr :[]
    };
  },
  components: {
    NavBar,
    cover
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
  	if(from.name == 'history'){
		this.recordScroll();
  	}
   next();
  },
  activated() {

  },
  filters:{
  	filterTime(val) {
  	  if(val){
  	    // return val.split('T')[0]
  		return val.substring(0,10) + ' ' + val.substring(11,16)
  	  }
  	  return "";
  	}
  },
  
  methods: {
	  
	  returnPage(){
	  	this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  	this.$router.go(-1)
	  },
	  onSwipeLeft(){
		  
	  },
	  onSwipeRight(){
		  
	  },
	  recordScroll(){
	    let pageScroll = this.$refs['pageScroll']
	    if(pageScroll){
	  	  for(let i =0;i<pageScroll.length;i++){
			  console.log(pageScroll[i].scrollTop)
	  		  this.curScroll['pageScroll_'+i] = pageScroll[i].scrollTop
	  	  }
	    }
	  },
	  // 之前滚动位置跳转
	  toBeforeScroll(){
	    let pageScroll = this.$refs['pageScroll']
	    if(pageScroll){
	  	  for(let i =0;i<pageScroll.length;i++){
			  console.log(this.curScroll['pageScroll_'+ i])
	  		  pageScroll[i].scrollTop = this.curScroll['pageScroll_'+ i]
	  	  }
	    }
	  },
    onScroll(){

    },
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  this.queryLastLoginUser()
      // const menu = [{DICT_NAME:'收藏'}/*,{DICT_NAME:'历史'}*//*,{DICT_NAME:'评论'}*/]
	  // const menu = [{DICT_NAME:'漫画',value:'2'},{DICT_NAME:'视频',value:'4'},/*{DICT_NAME:'演员',value:'6'},*/{DICT_NAME:'作品',value:'7'}]
   //    this.category = this.changeCategory(menu);
   //    this.selectArticle();
		
    },
	async queryLastLoginUser(){
		const data = await this.$http.get("/history/queryLastLoginUser")
		console.log(data.data)
		this.userLoginArr = data.data.data.list
		this.finished = true
	},
	
    changeCategory(data) {
      const category1 = data.map((item, index) => {
		item.loadMode = item.value
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 10;
        return item;
      });
      return category1;
    },
    async selectArticle() {},
	// 页面跳转
	toPage(detailitem){
		console.log(detailitem)
		// 视频页面
		if(detailitem.loadMode == 4){
		  if(this.$route.path != `/article/${detailitem.id}/${detailitem.loadMode}`) {
		      this.$router.push(`/article/${detailitem.id}/${detailitem.loadMode}`)
		  }
		}
		// 漫画页面
		if(detailitem.loadMode == 2){
			this.$router.push(`/manga/${detailitem.id}`)
		}
		// 漫画明细页面
		if(detailitem.loadMode == 5){
		    this.$router.push(`/mangaDetail/${detailitem.id}/${detailitem.pxh}`)
		}
		//  人员
		if(detailitem.loadMode == 6){
		    this.$router.push(`/person/${detailitem.id}/SEX`)
		}
		// 作品
		if(detailitem.loadMode == 7){
		    this.$router.push(`/personWork/${detailitem.id}`)
		}
	},
    onRefresh() {       //下拉刷新

				setTimeout(() => {
				    this.finished = false;
				    this.isLoading = false;
				    // this.list = []
				    let categoryitem = this.categoryItem();
				    categoryitem.page = 1;
				    categoryitem.list = []
					categoryitem.finished = true;
					categoryitem.loading = false;
				    this.selectArticle();
				}, 500);
            },
    onLoad() {
      // const categoryitem = this.categoryItem();
	  // console.log(categoryitem)
	  // if(categoryitem.list.length == 0){
		 //  categoryitem.finished = true
	  // }
      setTimeout(() => {
        // categoryitem.page += 1;
        this.selectArticle();
      }, 1000);
    },
    categoryItem() {
      const categoryitem = this.category[this.active];
      // console.log(categoryitem)
      return categoryitem;
    },

  },
  watch: {
	  $route(to,from) {
	  	// 跳转高度
	  	if(to.name == 'history'){
	  		this.$nextTick(()=>{
	  				this.toBeforeScroll()
	  		})
	  			
	  	}
	  },
    active() {
      const categoryitem = this.categoryItem();
      if (!categoryitem.list.length) {
        this.selectArticle();
      }
    }
  },
  created() {
      this.selectCategory();
  }
};
</script>

<style lang="less" scoped>
/deep/.van-collapse-item__content{
	border:none;
	padding: 0;
	color: #969799;
	font-size: 14px;
	line-height: 1.5;
	background-color: #fff;
}

</style>
