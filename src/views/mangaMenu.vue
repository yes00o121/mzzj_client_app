<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
		<!-- <van-sticky >
			<van-cell  style="z-index:99999;"  icon="arrow-left" :title="manga.title"  @click="returnPage"/>
		</van-sticky> -->
		<van-sticky >
			<van-cell  style="z-index:999;"  icon="arrow-left" :title="manga.title"  @click="returnPage">
				<van-button style="margin-right:1rem" plain type="default" size="mini" @click.stop="collectionClick" :class="{activeColor:collectionActive}">
					<van-icon  name="star-o" size=".5rem" />
					<span>&nbsp;收藏</span>
				</van-button>
				<van-icon
					slot="right-icon"
					name="wap-home-o"
					size="1.2rem"
					style="line-height: inherit;"
					@click.stop="$router.push('/')"
				  />
			</van-cell>
		</van-sticky>
  <div class="home" v-if="category" :style="'height:'+windowWidth+'px'">
	<div style="position: relative;height:300px" >
		<!-- <van-image
		   fit="contain"
		   :src="baseURL + manga.previewImg + '&width='+width+'&height='+windowWidth + '&random=1&token=' + token" rel="external nofollow" 
		   style="width:100%;"
		 > -->
		 <van-image
		   fit="contain"
		   :src="baseURL + '/file/getfilestreamManga/'+manga.id + '?random=1&token=' + token" rel="external nofollow" 
		   style="width:100%;"
		 >
		 <template v-slot:error>加载失败</template>
		 		<template v-slot:loading>
		 		    <van-loading type="spinner" size="20" />
		 		  </template>
		 </van-image>
		 <!-- <div style="position: absolute;right:0;bottom:0;">
			<van-button plain type="default" @click="collectionClick" :class="{activeColor:collectionActive}">
				<van-icon style="top:5px" name="star-o" size="1.5rem" />
				<span>&nbsp;收藏</span>
			</van-button>
		</div> -->
	</div>
    <div class="categorytab" >
	  <back-top :showHeight="300" ref="backtop"></back-top>
      <van-tabs v-model="active" swipeable animated>
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
			<!-- :icon="baseURL + categoryitem.imgUrl" -->
             <div class="detailparent" ref="tab">
				 <van-swipe-cell style="width:100%">
				   <van-card
				   lazy-load
				   @click="toDetail(categoryitem)"
				   v-for="(categoryitem,categoryindex) in item.list"
				     :title="categoryitem.title"
				     class="goods-card"
				     :thumb="baseURL + '/file/getfilestreamManga/' + categoryitem.imgUrl +'?region=true&token=' + token"
					 style="border-bottom: 1px solid #ebedf0;"
					 :desc="categoryitem.createtime | filterTime"
				   />
				 </van-swipe-cell>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
  </v-touch>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "./cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
		windowWidth:'300',
		// curScroll:0, // 当前滚动位置
	  curPage:null, // 当前页面路径
		width:'',
		height:'',
      img:'',
	  currentScroll:0,// 高度
	  collectionActive:false,
      manga:{}, // 漫画基础信息
      category: [],
      active: 0,
	  token: 'Bearer ' + localStorage.token,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  components: {
    NavBar,
    cover,
	backTop
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
	// 判断路径是否和之前一样,不一样重新加载数据
	if(this.$route.params.id != this.curPage){
		this.category = [];
		// this.curPage = this.$route.params.id
		this.selectCategory();
		this.collectionInit()
	}
	this.curPage = this.$route.params.id // 当前页面设置为该id
  },
  filters:{
  	filterTime(val) {
  	  if(val){
  	  		var date = new Date(val);
  	  		var year = date.getYear() + 1900
  	  		var month = date.getMonth() + 1
  	  		var day = date.getDate();
  	  		return year + '-' + month + '-' + day
  	  }
  	  return "";
  	},
  },
  methods: {
	  load(){
	
	  },
	  //收藏文章
	  async collectionClick() {
	     if(localStorage.getItem('token')){
	       // 判断显示状态,是收藏还是取消收藏
	       if(!this.collectionActive){
	         const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'1'})
	         // console.log(res)
	         if(res.data.data == '收藏成功'){
	             this.collectionActive = true
	         }else{
	             // this.collectionActive = false
	             this.$msg.fail(res.data.message)
	         }
	       } else {
	         const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'1'})
	         if(res.data.data == '取消成功'){
	           this.collectionActive = false
	         } else {
	            this.$msg.fail(res.data.message)
	         }
	       }
	  
	          // this.$msg.fail(res.data.msg)
	     }
	  },
	  //进入页面获取是否收藏
	  async collectionInit() {
	      if(localStorage.getItem('token')){
	          const res = await this.$http.post('/collection/queryCollectionByUseridAndDetailDataId',{
	              webInfoDetailDataId:this.$route.params.id
				  ,collectionType:'1'
	          })
	          // console.log(res.data)
	      this.collectionActive = res.data.data == '1' ? true : false;
	      }
	  },
    onScroll(){
      // console.log('2222222222222222')
    },
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  this.$msg.loading({
	    message: '加载中...',
	    forbidClick: true,
	    loadingType: 'spinner'
	  });
	  // this.showloading()
	  // scroll(0,0)
      // 查询漫画基础信息
      const res = await this.$http.post('/webInfoDetailData/queryDetailDataByTypeId',{
		loadMode:'2',
        id:this.$route.params.id
      })
      // console.log(res.data)
      this.manga = res.data.data.list[0]
      // this.$route.params.id
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      const menu = [{DICT_NAME:this.manga.title}]
      this.category = this.changeCategory(menu);
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        // console.log(item)
        item.list = [];
        item.page = 0;
        item.finished = false;
        item.loading = true;
        item.pagesize = 100000;
        return item;
      });
      return category1;
    },
    async selectArticle() {
      const categoryitem = this.categoryItem();
      // 获取漫画目录数据
        const res = await this.$http.post('/manga/queryMangaMenuByWebInfoDataId',{
          webInfoDataId:this.$route.params.id,
		  pxh:this.$route.params.pxh
        })
		// console.log(res.data.data)
        // const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
        //   typeId: categoryitem.CODE_VALUE,
        //   pageNum: categoryitem.page,
        //   pageSize: categoryitem.pagesize,
        //   search: ''
        // })

        categoryitem.list.push(...res.data.data);
        categoryitem.loading = false;
        if (res.data.data.length < categoryitem.pagesize) {
		  categoryitem.loading = true;
          categoryitem.finished = true;
        }
		// this.hideloading()
		this.$msg.clear()
    },
	onSwipeLeft () {
		// alert('页面右滑')
	    // console.log('页面左滑')
	  // this.$router.go(-1)
	},
	onSwipeRight(){
		if(localStorage.slideReturn == 1){
			this.$router.go(-1)
		}
	    // alert('页面右滑')
		// 跳转其他页面的时候记录高度
		// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// alert('漫画高度' + this.curScroll)
	    // this.$router.go(-1)
	},
	toDetail(item){
		// console.log(item)
		// 跳转漫画明细页面
		// this.$route.push()
		 this.$router.push(`/mangaDetail/${item.webInfoDetailDataId}/${item.pxh}`)
	},
	returnPage(){
		// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// alert('漫画高度' + this.curScroll)
		this.$router.go(-1)
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
        categoryitem.page = 1;
        this.selectArticle();
      }, 1000);
    },
    categoryItem() {
      const categoryitem = this.category[this.active];
      // console.log(categoryitem)
      return categoryitem;
    },

  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	if(from.name == 'manga'){
		this.currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
	}
   next();
  },
  // 其他页面跳转过来
  beforeRouteEnter(to, from,next){
	  next();
  },
  destroyed(){

  },
  watch: {
	  $route(to,from) {
		  // 跳转高度
		  if(to.name == 'manga'){
		  	document.documentElement.scrollTop = this.currentScroll
		  	document.body.scrollTop = this.currentScroll
			// 可能在看漫画的时候取消收藏了,跳转的时候在检查一下
			this.collectionInit();
		  }
	  },
    active() {
      const categoryitem = this.categoryItem();
      if (!categoryitem.list.length) {
        this.selectArticle();

        // this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
      }
    }
  },
  created() {
	  this.selectCategory();
	  this.collectionInit()
	  this.$nextTick(()=>{
		  // let war = this.$refs.
		  this.width = document.body.clientWidth
	  })
  },
  $route() {
      this.collectionInit()
  },
  mounted(){
    // this.select
  }
};
</script>

<style lang="less" scoped>
.activeColor{
            color: #fb7299;
        }
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

.goods-card {
  margin: 5;
  background-color: white;
}

.delete-button {
  height: 100%;
}
.van-card__thumb{
	position: relative;
	    -webkit-box-flex: 0;
	    -webkit-flex: none;
	    flex: none;
	    width: 120px;
	    height: 80px;
	    margin-right: 20px;
}
.van-card__title{
	font-size:16px;
	
}

.van-card__desc{
bottom: 0;
    position: absolute;
}
.van-swipe-cell{
	position: relative;
	    overflow: hidden;
	    background: white;
	    cursor: grab;
}
input[type='button']:enabled:active, input[type='button'].mui-active:enabled, input[type='submit']:enabled:active, input[type='submit'].mui-active:enabled, input[type='reset']:enabled:active, input[type='reset'].mui-active:enabled, button:enabled:active, button.mui-active:enabled, .mui-btn:enabled:active, .mui-btn.mui-active:enabled{
	color:black;
	background-color:white
}
.van-button--hairline::after{
	border-color:white
}
.van-button::before{
	// border-color:black;
	border-color:black;
	background-color:white;
}
.van-cell__title{
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.activeColor{
            color: #fb7299;
        }
input[type='button']:enabled:active, input[type='button'].mui-active:enabled, input[type='submit']:enabled:active, input[type='submit'].mui-active:enabled, input[type='reset']:enabled:active, input[type='reset'].mui-active:enabled, button:enabled:active, button.mui-active:enabled, .mui-btn:enabled:active, .mui-btn.mui-active:enabled{
	color:black;
	background-color:white
}
.van-button--hairline::after{
	border-color:white
}
.van-button::before{
	// border-color:black;
	border-color:black;
	background-color:white;
}
</style>
