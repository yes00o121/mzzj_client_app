<template>
  <div class="home" v-if="category">
    <div class="categorytab">
      <van-tabs v-model="active" swipeable sticky animated >
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy >
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" @scroll="onScroll">
            <van-list
			style="padding-bottom: 50px;"
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
			<div role="feed" class="van-list">
						  	<div class="detailparent">
						  		<div class="van-swipe-cell" style="width: 100%;" v-for="(categoryitem,categoryindex) in item.list" @click="toPage(categoryitem)">
						  			<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
						  				<div class="goods-card van-card" style="border-bottom: 1px solid rgb(235, 237, 240);">
						  					<div class="van-card__header">
						  						<a class="van-card__thumb">
						  							<div class="van-image" style="width: 100%; height: 100%;">
						  								<!-- <img class="van-image__img" data-src="http://192.168.1.4:8090/common/image?imgId=6102545b1734cb921086f39f&amp;region=true&amp;token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5YW5nY2hlbiIsImNyZWF0ZWQiOjE2MzE4NDM0MTIwNTYsImV4cCI6MjIzNjY0MzQxMn0.3dTJCHt_n7ZH--Nt23vYHQXPeWaWkbGE97zSqvF-lCrlZvOGys6FQO4x4h4TnorBXutuB_IpZFwU2NCI1IfUXA"
						  								src="http://192.168.1.4:8090/common/image?imgId=6102545b1734cb921086f39f&amp;region=true&amp;token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5YW5nY2hlbiIsImNyZWF0ZWQiOjE2MzE4NDM0MTIwNTYsImV4cCI6MjIzNjY0MzQxMn0.3dTJCHt_n7ZH--Nt23vYHQXPeWaWkbGE97zSqvF-lCrlZvOGys6FQO4x4h4TnorBXutuB_IpZFwU2NCI1IfUXA"
						  								lazy="loaded" style="object-fit: cover;"> -->
														<!-- <van-image ref="workImage" fit="cover" @onload="imgLoad(categoryindex)" lazy-load :src="baseURL + categoryitem.message_photo +'&token=' + token" style="width:100%"/> -->
														<!-- <image  src="@/assets/mzzj120.png"  style="width:100%" v-if="!categoryitem.icon"/> -->
														<van-image ref="workImage"  lazy-load :src="baseURL + categoryitem.head +'&token=' + token" style="width:100%;width:40px" v-if="categoryitem.head"/>
														<img src="@/assets/default_img.jpg" style="height:30px;width:30px" alt=""  v-else>
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
														<div class="van-card__type2 van-ellipsis" style="text-align:left;">
															{{categoryitem.personName}}
														</div>
														<div class="van-card__desc van-ellipsis " style="top:1.5rem">
															{{categoryitem.createtime}}
														</div>
						  							</div>
						  							<div class="van-card__bottom">
														<!-- 作品内容 -->
														<div v-if="categoryitem.type == 'work'">
															<!-- 标题 -->
															<div class="title van-multi-ellipsis--l3">
																<h1>{{categoryitem.title}}</h1>
															</div>
															<!-- 预览图片 -->
															<div class="conver">
																<van-image ref="workImage"  lazy-load :src="baseURL + categoryitem.photo +'&token=' + token" />
															</div>
														</div>
														<!-- 视频内容 -->
														<div v-if="categoryitem.type == 'video'">
															<!-- 标题 -->
															<div class="title van-multi-ellipsis--l3">
																<h1>{{categoryitem.title}}</h1>
															</div>
															<!-- 视频数据可播放 -->
															<div style="height: auto;"  class="conver">
																<article-video ref="articleRef" 
																 @playVideo = "playVideo"
																 :Item="categoryitem"></article-video>
															</div>
														</div>
														<!-- 漫画内容 -->
														<div v-if="categoryitem.type == 'manga'">
															<!-- 标题 -->
															<div class="title van-multi-ellipsis--l3">
																<h1>{{categoryitem.title}}</h1>
															</div>
															<!-- 漫画预览图片 -->
															<div class="conver">
																<van-image ref="workImage"  lazy-load :src="baseURL + categoryitem.photo +'&token=' + token" />
															</div>
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
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
// import cover from "@/views/cover";
import articleVideo from '@/views/Article'
export default {
  data() {
    return {
		token: 'Bearer ' + localStorage.token,
      category: [],
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  currentScroll:0,// 滚动高度
    };
  },
  components: {
    NavBar,
    articleVideo
  },
  watch:{
	  $route(to,from) {
		  if(to.name == 'dynamic'){
		  	this.$nextTick(()=>{
		  		document.documentElement.scrollTop = this.currentScroll
		  		document.body.scrollTop = this.currentScroll
		  	})
		  }
	  }
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
  },
  methods: {
	  showPageToolMethod(){
		  
	  },
	  fetchCommentsAndShowList(){
		  
	  },
	  playHandler(){
		  
	  },
	  toPage(item){
		console.log(item)  
		// 跳转页面
		this.$router.push(item.nextAddress)
	  },
    onScroll(){
      console.log('2222222222222222')
    },
	playVideo(item){
		// console.log('视频开始播放了////')
		// console.log(item)
		let articleRef = this.$refs.articleRef
		for(let i =0;i<articleRef.length;i++){
			
			if(item.id != articleRef[i].Item.id){
				articleRef[i].myVideo.pause()
				console.log(articleRef[i])
			}
		}
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      // console.log(res)
      const menu = [{DICT_NAME:'关注'}/*,{DICT_NAME:'消息'}*/]
      this.category = this.changeCategory(menu);
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
	const res = await this.$http.post("/ranking/queryCollectionData", {
          // typeId: categoryitem.CODE_VALUE,
          pageNum: categoryitem.page,
          pageSize: categoryitem.pagesize,
          // : ''
        })
        if(res.data.data.list == 0){
          categoryitem.finished = true;
          return
        }
        categoryitem.list.push(...res.data.data.list);
        categoryitem.loading = false;
        if (res.data.data.list.length < categoryitem.pagesize) {
          categoryitem.finished = true;
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
  watch: {
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
  }
};
</script>

<style lang="less" scoped>
.home {
  // background-color: white;
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
    background-color: #ee0a24;
  }
}

/deep/ .van-card__thumb img{
	border-radius:30px;
}

/deep/ .van-swipe-cell{
	// height:4rem;
}

/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    height: 88px;
	    margin-right: 8px;
}

/deep/ .van-card__content{
	// height:4rem;
}

/deep/ .van-card__tag{
	position: absolute;
	    top: 2px;
	    left: -1rem;
}

/deep/ .van-card__desc{
	position: absolute;
	left: 0;
	bottom: 0;
	text-align: left;
}

/deep/ .van-card__type2{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 left: 0; 
		right: 0;
	letter-spacing:1px;
}
.title{
	text-align:justify;
	// letter-spacing:.5px;
}

/deep/ .van-card__bottom{
	line-height:5px;
	padding-top:3rem;
}
/deep/ .van-card__header{
	display: flex;
	height:auto;
}
.conver{
	padding-top:10px;
}
</style>
s