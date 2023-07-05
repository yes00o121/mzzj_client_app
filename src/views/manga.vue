<template>
  <div class="home" >
	  <nav-bar :title="'漫画'" :rightButtonType="'search'" @onSearch="onSearch"></nav-bar>
    <div class="categorytab"  v-show="tabActive == 0" >
		<back-top :showHeight="300" ref="backtop"></back-top>
      <van-tabs v-model="active" swipeable sticky  animated offset-top="40">
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy  >
			<!-- 嵌套一层div做内容滚动区域, 一定要有确定高度，可以使用高度100%或calc(100vh - ?px) -->
			<div style="height: calc(100vh - 10vh); overflow: auto;-webkit-overflow-scrolling: touch;" :ref="'pageScroll'" @scroll="scrolls">
				<!-- <back-top :showHeight="100"></back-top> -->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
			  <van-swipe :autoplay="5000" id="swipeId" v-if="showSwipe">
			    <van-swipe-item v-for="(image, index) in item.flowData" :key="index" :loop="false" :width="300">
				  <van-image
				    width="22rem"
				    height="15rem"
				    fit="cover"
					style="object-position: top;"
				    :src="baseURL +  '/file/getfilestream/' +  image.previewImg + '?token=' + token" rel="external nofollow" 
					@click="toPage(image)"
				  >
				  </van-image>
				  <div class="swipe-text van-ellipsis">
					  {{image.title}}
				  </div>
			    </van-swipe-item>
			  </van-swipe>
            <van-list 
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab" v-show="item.CODE_VALUE != 2">	
                <cover
				  :type="2"
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  
                />
              </div>
            </van-list>
          </van-pull-refresh>
		  </div>
        </van-tab>
      </van-tabs>
    </div>

  </div>
</template>	

<script>
import navBar from "@/components/base/NavBar.vue";
import cover from "./cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
		searchText:'',// 搜索内容
		showSwipe:true,
		token: 'Bearer ' + localStorage.token,
	  curScroll:{},
      category: [],
	  tabActive:0,// 底部菜单
	  beforetabActive:0,// 之前选中的底部
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	  this.recordScroll()
	  next()
  },
  beforeRouteEnter(to, from,next){
	  next()
  },
  components: {
    cover,
	backTop,
	navBar
  },
  activated() {},
  methods: {
	  // 查询
	  onSearch(text){
		this.searchText = text;
		this.selectCategory()
	  },
	  returnPage(){
		  this.$router.go(-1)
	  },
	toPage(item){
		const categoryitem = this.categoryItem();
		 this.$router.push(`/manga/${item.dataId}`)
	},
	  slideTo (targetPageY,ref,fun) {
	    var timer = setInterval(function () {
	        var currentY = ref.scrollTop;//当前及滑动中任意时刻位置
	        var distance = targetPageY > currentY ? targetPageY - currentY : currentY - targetPageY;//剩余距离
	        var speed = Math.ceil(distance/10);//每时刻速度
	        if (currentY == targetPageY) {
	         clearInterval(timer);
			 fun()
	        } else {
				ref.scrollTo(0,targetPageY > currentY ? currentY + speed : currentY - speed);
	        }
	       },10);
	   },
	  scrolls(e){},
	  // 之前滚动位置跳转
	  toBeforeScroll(cur){
		  let pageScroll = this.$refs['pageScroll']
		  for(let i =0;i<pageScroll.length;i++){
		  	  pageScroll[i].scrollTop = this.pageScroll[this.$route.name + 'pageScroll_'+ i]
		    }
		 //  if(pageScroll && cur == 0){
			//   for(let i =0;i<pageScroll.length;i++){
			// 	  pageScroll[i].scrollTop = this.pageScroll[this.$route.name + 'pageScroll_'+ i]
			//   }
		 //  }
		 //  if(cur == 1){
			//    this.$nextTick(()=>{
			// 		if(this.$refs.hot){
			// 			this.$refs.hot.toBeforeScroll()
			// 		}  
			// })
		 //  }

	  },
	  // 记录滚动位置
	  recordScroll(){
		  let pageScroll = this.$refs['pageScroll']
		  console.log('滚动位置为..' + pageScroll)
		  for(let i =0;i<pageScroll.length;i++){
			  this.pageScroll[this.$route.name + 'pageScroll_'+i] = pageScroll[i].scrollTop
			  
		  }
		  // if(cur == 1){
			 //  if(this.$refs.hot){
				//   this.$refs.hot.recordScroll()
			 //  }
		  // }

	  },
    onScroll(){

    },
    async selectCategory() {
	  const res = [{
		  DICT_NAME:'漫画',
		  CODE_MODE_TYPE:2
	  }]
      this.category = this.changeCategory(res);
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
        // console.log(item)
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 20;
		// 初始化的时候追加热门数据
		this.$http.post("/ranking/queryLatelyFlowData", {
			dataType: 2
		}).then(res=>{
			item.flowData = res.data.data
		})
		
        return item;
      });
      return category1;
    },
	
    async selectArticle() {
      const categoryitem = this.categoryItem();
		const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
		  typeId: categoryitem.CODE_VALUE,
		  pageNum: categoryitem.page,
		  pageSize: categoryitem.pagesize,
		  search: this.searchText,
		  loadMode:categoryitem.CODE_MODE_TYPE
		})
		categoryitem.list.push(...res.data.data.list);
		categoryitem.loading = false;
		if (res.data.data.list.length < categoryitem.pagesize) {
		  categoryitem.loading = true;
		  categoryitem.finished = true;
		}
	
    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
					this.showSwipe = false;// 下拉后隐藏滚动
                    this.finished = false;
                    this.isLoading = false;
                    let categoryitem = this.categoryItem();
                    categoryitem.page = 1;
                    categoryitem.list = []
					categoryitem.finished = false;
                    this.selectArticle();
                }, 500);
            },
    onLoad() {
      const categoryitem = this.categoryItem();
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
      return categoryitem;
    }
  },
  
  watch: {
    active(current,before) {
	  const categoryitem = this.categoryItem();
	  // 切换时候记录之前位置
      if (!categoryitem.list.length) {
        this.selectArticle();
      }
    },
	tabActive(cur,bef){
		this.recordScroll(bef)
		this.$nextTick(()=>{
			this.toBeforeScroll(cur)
		})
	}
  },
  created() {
	  
	  this.$msg.loading({
	    message: '加载中...',
	    forbidClick: true,
	    duration:0
	  });
      this.selectCategory();
	  this.$msg.clear()
  }
};
</script>

<style lang="less" scoped>
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
.swipe-text{
	position: absolute;
	    bottom: 0.2rem;
	    margin-left: 0.75rem;
	    height: 30px;
	    line-height: 30px;
	    font-family: "Microsoft YaHei";
	    font-size: 16px;
	    position: absolute;
	    background: #5fa3ea;
		color:white;
		padding: 0 1rem;
		max-width:19rem;
}

.cell-distance{
	padding: 10px 16px;
}

.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}
.participates-photo{
	/* -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3); */
	width:100%;
	 // height:30.778vw;
	height:100%;
	/* height:100%; */
	/* height:90px; */
	margin:.0rem .3rem;
	/* float:left */
}
#swipeId img{
	object-position:top;
	border-radius:15px;
}
/deep/ .van-tabs__wrap{
	overflow:hidden;
	display:none;
}
/deep/ .van-swipe-item img{
	object-position:top;
}
</style>
