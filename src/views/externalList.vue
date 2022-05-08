<template>
  <div class="home" >
	  <van-sticky>
	  	<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" title=""  @click="returnPage">
	  		<van-icon
	  		    slot="right-icon"
	  		    name="wap-home-o"
	  			size="1.2rem"
	  		    style="line-height: inherit;"
	  			@click.stop="$router.push('/')"
	  		  />
	  	</van-cell>
	  </van-sticky>
	<!-- home -->
    <div class="categorytab"  v-show="tabActive == 0" >
      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <van-tabs v-model="active" swipeable sticky  animated offset-top="40">
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy  >
			<div slot="title">
			      <!-- <van-icon name="more-o" />选项 -->
				  <div>
					<van-icon name="photo-o" v-if="item.CODE_VALUE != '9'" size="1rem" />
					<van-icon name="user-o" v-if="item.CODE_VALUE == '9'" size="1rem"/>
					  {{item.DICT_NAME}}
				  </div>
			</div>
			<!-- 嵌套一层div做内容滚动区域, 一定要有确定高度，可以使用高度100%或calc(100vh - ?px) -->
			<div style="height: calc(100vh - 10vh); overflow: auto;-webkit-overflow-scrolling: touch;" :ref="'pageScroll'" @scroll="scrolls">

          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >

            <van-list 
			  style="padding-bottom: 20%;"
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab" v-show="item.CODE_VALUE != 2">	
                <coverr-external
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
import coverrExternal from "./coverrExternal";

export default {
  data() {
    return {
		person:{},
		dynamicNum:null,
		showSwipe:true,
		myIconStatus:false, // "我的图标状态"
	    personParams:{},// 人员参数
		token: 'Bearer ' + localStorage.token,
	  curScroll:{},
		curVideo:'',
	  curTableHeight:0, // 当前table高度
	  tabbarStatus:true, // 底部菜单是否显示
	  dynamicNum:null, // 动态数量
      category: [],
	  tabActive:0,// 底部菜单
	  beforetabActive:0,// 之前选中的底部
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  // websocket:null
	  // videoStatus:true, // 视频状态,用于子组件刷新
    };
  },
  filters:{
	  filterTime(val) {
	    if(val){
	      return val.split('T')[0]
	    }
	    return "";
	  }
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){

	  next()
  },
  beforeRouteEnter(to, from,next){
	  next()
  },
  components: {
    coverrExternal
  },
  activated() {

		// this.toBeforeScroll(this.tabActive)
		// console.log('显示了呢...')
		// console.log(this.websocket)

  },
  methods: {
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		toPage(item){
			console.log(item)

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
	  toBeforeScroll(cur){},
	  // 记录滚动位置
	  recordScroll(cur){},


    async selectCategory() {

	  let menu = [{
		  CODE_VALUE:'1',
		  CODE_NAME:'视频'
	  }]
      this.category = this.changeCategory(menu);
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
        return item;
      });
      return category1;
    },

	
    async selectArticle() {
      const categoryitem = this.categoryItem();

			console.log(categoryitem)
			// const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			//   typeId: categoryitem.CODE_VALUE,
			//   pageNum: categoryitem.page,
			//   pageSize: categoryitem.pagesize,
			//   search: '',
			//   loadMode:categoryitem.CODE_MODE_TYPE
			//   // loadMode:categoryitem.CODE_VALUE == 2 ? 9 : '2'
			// })
			this.$msg.loading({
			  message: '加载中...',
			  duration:0,
			  // forbidClick: true,
			  loadingType: 'spinner'
			});
			const res = await this.$http.post('/externalHandler/getPageTypeDataDetail',{
				id:this.$route.params.id,
				url:this.$route.params.url,
				page:categoryitem.page
			})
			console.log(res)
			categoryitem.list.push(...res.data);
			categoryitem.loading = false;
			if (res.data.length < categoryitem.pagesize) {
			  categoryitem.loading = true;
			  categoryitem.finished = true;
			}
			this.$msg.clear()

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
      // console.log(categoryitem)
      return categoryitem;
    },
	
  },
  
  watch: {
	  $route(to,from) {
	  	// 跳转高度
	  	if(to.name == 'externalList'){
	  		// alert(this.currentScroll)
	  		this.$nextTick(()=>{
	  			document.documentElement.scrollTop = this.currentScroll
	  			document.body.scrollTop = this.currentScroll
	  		})
	  	}
	  	
	  	// id不同刷新
	  	if(to.name =='externalList' && to.params.url != this.person.id){
	  		this.$msg.loading({
	  		  message: '加载中...',
	  		  forbidClick: true,
	  		  duration:0
	  		});
			this.person = {}
	  		this.selectCategory();
	  		this.$msg.clear()
	  	}
	  }
  },
  created() {
	  this.person.id = this.$route.params.url
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
</style>
