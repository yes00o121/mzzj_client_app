<template>
  <div class="home" v-if="category">
    <nav-bar v-show="tabActive != 2" :style="{height : active == 2 ? '0px' : 'auto'}"></nav-bar>
	<!-- home -->
    <div class="categorytab" v-show="tabActive == 0">
		
      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <van-tabs v-model="active" swipeable sticky animated >
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy  >
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list 
			 v-show="active != 2"
			  style="padding-bottom: 50px;"
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab">	
                <cover
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  
                />
              </div>
			  
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
	  <shortvideo v-if="active == 2"></shortvideo>
    </div>
	<div v-if="tabActive == 1" style="heihgt:800px">
		<video controls :src="'http://192.168.1.6:8090/video/person/香港美少女(HongKongDoll)/video/' + curVideo"></video>
			  <div v-for="item in videoList">
				  <van-button type="info" @click="curVideo = item">{{item}}</van-button>
			  </div>
	</div>
	<userinfo v-show="tabActive == 3"></userinfo>
	<dynamic v-if="tabActive == 2"></dynamic>
	<van-tabbar
	  v-model="tabActive"
	  active-color="#07c160"
	  inactive-color="#000"
	  v-show="tabbarStatus"
	>
	  <van-tabbar-item icon="home-o" @click="home">首页</van-tabbar-item>
	  <van-tabbar-item icon="fire-o" @click="hit">热门</van-tabbar-item>
	  
	  <van-tabbar-item icon="underway-o"  :info="dynamicNum" @click="dynamic">动态</van-tabbar-item>
	  <van-tabbar-item icon="user-o" @click="my">我的</van-tabbar-item>
	  <!-- <van-tabbar-item icon="underway-o" v-show="dynamicNum >0" :info="dynamicNum" @click="dynamic">动态</van-tabbar-item> -->
	</van-tabbar>
  </div>
</template>	

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "./cover";
import dynamic from "./dynamic"
import userinfo from './userinfo'
import shortvideo from './video'
export default {
  data() {
    return {
		curVideo:'',
	  curTableHeight:0, // 当前table高度
	  tabbarStatus:true, // 底部菜单是否显示
	  dynamicNum:null, // 动态数量
      category: [],
	  tabActive:0,// 底部菜单
	  beforetabActive:0,// 之前选中的底部
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  websocket:null,
	  normalHead:{
		  height:'auto'
	  },
	  videoHead:{
		  height:'400px',
	  }
    };
  },
  components: {
    NavBar,
    cover,
	userinfo,
	dynamic,
	shortvideo
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
	const scrollTop = this.$route.meta.scrollTop;
	    const $content = document.querySelector('.content');
	    if (scrollTop && $content) {
	      $content.scrollTop = scrollTop;
	    }
  },
  methods: {
	  hit(){
		  this.beforetabActive = this.tabActive 
		  this.$msg('功能开发中')
	  },
	  dynamic(){
		  this.beforetabActive = this.tabActive 
		  this.$msg('功能开发中')
	  },
	  my(){
		  this.beforetabActive = this.tabActive
		  // this.$msg('功能开发中')
	  },
    onScroll(){

    },
	home(){
		if(this.tabActive == 0 && this.beforetabActive == 0){
			scrollTo(0,0)
			this.isLoading = true
			this.onRefresh()
		}
		this.beforetabActive = this.tabActive
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  this.videoList = []
	   const res1 = await this.$http.get("/webInfoDetailData/queryVideoRandom");
	  		console.log(res1)
	  this.videoList = res1.data
	  console.log(this.videoList)
      const res = await this.$http.get("/webInfoDetailData/queryMenu");
      this.category = this.changeCategory(res.data.data);
      this.selectArticle();
    },
    changeCategory(data) {
		// const res = this.$http.get("/webInfoDetailData/queryVideoRandom");
		// console.log(res)
		
      const category1 = data.map((item, index) => {
        // console.log(item)
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
		// 如果categoryitem.CODE_VALUE等于9,但是查询女优数据
		if(categoryitem.CODE_VALUE == 9){
			const res = await this.$http.post("/person/queryPerson", {
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  personType:'SEX'
			})
			for(let i =0;i<res.data.data.list.length;i++){
				res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
				res.data.data.list[i].previewImg = '/common/image?imgId=' + res.data.data.list[i].person_photp
				res.data.data.list[i].title = res.data.data.list[i].person_name
			}
			// console.log(res)
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.length < categoryitem.pagesize) {
			  categoryitem.finished = true;
			}
		}
		if(categoryitem.CODE_VALUE != 5){
			const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			  typeId: categoryitem.CODE_VALUE,
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  search: ''
			})
			
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.length < categoryitem.pagesize) {
			  categoryitem.finished = true;
			}
		}
       
		console.log(this.category)
    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    // this.list = []
                    let categoryitem = this.categoryItem();
                    categoryitem.page = 1;
                    categoryitem.list = []
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
	// 记录列表滚动位置
    recordScroll(active){
		const categoryitem = this.category[active];
		
		let rect = document.body.getBoundingClientRect()
		categoryitem.scroll = Math.abs(rect.top)
	}
  },
  watch: {
    active(current,before) {
		// 记录头部高度
		if(this.curTableHeight == 0) {
			this.curTableHeight = $('.van-tabs__wrap').height()
		}
		// 视频下隐藏头部和table
		if(current == 2){

			// 隐藏头部
			$('.van-tabs__wrap').height(0)
			this.tabbarStatus = false;
		} else {
			// alert(this.curTableHeight)
			$('.van-tabs__wrap').height(this.curTableHeight) // 显示头部
			this.tabbarStatus = true;
		}
		// console.log(e,a)
		// 		// console.log('qieh....')
		// 		console.log(document.body.getBoundingClientRect())
      const categoryitem = this.categoryItem();
	  // 切换时候记录之前位置
	  this.recordScroll(before)
	  // console.log(categoryitem)
      if (!categoryitem.list.length) {
        this.selectArticle();
        // this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
      }
	  // 定位指定位置
	  if(categoryitem.scroll){
	  	// console.log('开始定位...' + categoryitem.scroll)
		setTimeout(()=>{
			scrollTo(0,categoryitem.scroll)
		},50)
	  	
	  }
    }
  },
  created() {
	  
	 
      this.selectCategory();
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
};
</script>

<style lang="less">
.home {
  background-color: white;
}
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
    background-color: white;
  }
}

</style>
