<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;width:100%" :swipe-options="{direction: 'horizontal'}">
		<!-- <van-sticky >
			<van-cell  style="z-index:99999;"  icon="arrow-left" :title="manga.title"  @click="returnPage"/>
		</van-sticky> -->
	<div  v-show="!showPlayList">
		<van-sticky >
			<van-cell  style="z-index:999;"  icon="arrow-left" title="我的收藏"  @click="returnPage">
				<van-icon
					slot="right-icon"
					name="wap-home-o"
					size="1.2rem"
					style="line-height: inherit;"
					@click.stop="$router.push('/')"
				  />
			</van-cell>
		</van-sticky>
  <div class="home" v-if="category">
    <div class="categorytab">
<!-- 		<van-dropdown-menu>
		  <van-dropdown-item :value="loadMode" :options="option1" @change="onConfirm1" />
		  </van-dropdown-menu> -->
		  <back-top :showHeight="300"></back-top>
      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <van-tabs v-model="active" swipeable sticky animated offset-top="40">
        <!-- <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
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
                  :key="categoryindex"
                />
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab> -->
		<van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy >
<!-- 			<div slot="title">
				<div>
					<van-icon name="star-o" size="1rem" />
					<van-icon name="browsing-history-o" v-if="item.DICT_NAME == '历史'" size="1rem"/>
					  收藏
				</div>
			</div> -->
			<!-- 嵌套一层div做内容滚动区域, 一定要有确定高度，可以使用高度100%或calc(100vh - ?px) -->
			<div style="height: calc(100vh - 10vh); overflow: auto;-webkit-overflow-scrolling: touch;" :ref="'pageScroll'">
		  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
		   <!-- <van-list
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
		          :key="categoryindex"
		        />
		      </div>
		    </van-list> -->
			<van-list
			  v-model="item.loading"
			  :immediate-check="false"
			  :finished="item.finished"
			  finished-text="我也是有底线的"
			  @load="onLoad"
			  style="padding-bottom: 20%;"
			>
			  <div role="feed" class="van-list">
			  	<div class="detailparent">
			  		<div class="van-swipe-cell" style="width: 100%;" v-for="(categoryitem,categoryindex) in item.list" @click="toPage(categoryitem,categoryindex)">
			  			<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
			  				<div class="goods-card van-card" style="border-bottom: 1px solid rgb(235, 237, 240);">
			  					<div class="van-card__header">
			  						<a class="van-card__thumb">
			  							<div class="van-image" style="width: 100%; height: 100%;">
			  								<!-- <img class="van-image__img" data-src="http://192.168.1.4:8090/common/image?imgId=6102545b1734cb921086f39f&amp;region=true&amp;token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5YW5nY2hlbiIsImNyZWF0ZWQiOjE2MzE4NDM0MTIwNTYsImV4cCI6MjIzNjY0MzQxMn0.3dTJCHt_n7ZH--Nt23vYHQXPeWaWkbGE97zSqvF-lCrlZvOGys6FQO4x4h4TnorBXutuB_IpZFwU2NCI1IfUXA"
			  								src="http://192.168.1.4:8090/common/image?imgId=6102545b1734cb921086f39f&amp;region=true&amp;token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5YW5nY2hlbiIsImNyZWF0ZWQiOjE2MzE4NDM0MTIwNTYsImV4cCI6MjIzNjY0MzQxMn0.3dTJCHt_n7ZH--Nt23vYHQXPeWaWkbGE97zSqvF-lCrlZvOGys6FQO4x4h4TnorBXutuB_IpZFwU2NCI1IfUXA"
			  								lazy="loaded" style="object-fit: cover;"> -->
											<div>
												<van-image ref="workImage" v-if="categoryitem.loadMode == 2" fit="cover"  lazy-load :src="baseURL + '/file/getfilestreamManga/' +  categoryitem.ljid +'?token=' + token" style="width:100%"/>
												<van-image ref="workImage" v-if="categoryitem.loadMode == 4" fit="cover"  lazy-load :src="baseURL + '/file/getfilestreamVideo/' +  categoryitem.ljid +'?token=' + token" style="width:100%"/>
												<van-image v-if="categoryitem.loadMode == 6" fit="cover"  lazy-load :src="baseURL + '/file/getfilestreamNvyou/' + categoryitem.ljid +'?token=' + token" style="width:100%;"/>
												<van-image v-if="categoryitem.loadMode == 7" fit="cover"  lazy-load :src="baseURL + '/file/getfilestreamNvyouWork/' + categoryitem.ljid +'?token=' + token" style="width:100%;"/>
											</div>
											
			  							</div>
			  							<!-- <div class="van-card__tag">
			  								<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex < 3" style="background:#F25D8E;color:#FEFFFF">
			  									{{categoryindex + 1}}
			  								</span>
											<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex > 2" style="background:#B8C0CC;color:#FFFBFC">
												{{categoryindex + 1}}
											</span>
			  							</div> -->
			  						</a>
			  						<div class="van-card__content">
										
			  							<div>
			  								<div class="van-card__title van-multi-ellipsis--l2">
			  									{{categoryitem.title}}
			  								</div>
											<div style="position: absolute; right: 0;bottom: 1.5rem;">
											 </div>
											<div class="van-card__type van-ellipsis">
												 <van-tag type="primary">{{categoryitem.loadMode == 4 ? '视频' : (categoryitem.loadMode == 2 || categoryitem.loadMode == 5) ? '漫画' : categoryitem.loadMode == 6 ? '演员' : categoryitem.loadMode == 7 ? '作品' : '其他'}}</van-tag>
												<!-- {{categoryitem.loadMode == 4 ? '视频' : (categoryitem.loadMode == 2 || categoryitem.loadMode == 5) ? '漫画' : categoryitem.loadMode == 6 ? '演员' : categoryitem.loadMode == 7 ? '作品' : '其他'}} -->
											</div>
											<!-- <div class="van-card__num van-ellipsis">
												<van-icon name="play-circle-o" size="1rem" style="top: 0.2rem;"/>
												<span style="padding-left: 0.2rem;">{{categoryitem.flowNum | filterFlowNum}} </span>
											</div>
											<div class="van-card__chat van-ellipsis">
												<van-icon name="chat-o" size="1rem" style="top: 0.2rem;"/>
												<span style="padding-left: 0.2rem;">{{categoryitem.commentNum | filterFlowNum}}</span>
											</div> -->
			  								<div class="van-card__desc van-ellipsis">
			  									{{categoryitem.collectionTime | filterTime}}
			  								</div>
			  							</div>
			  							<div class="van-card__bottom">
			  								<div class="van-card__price" style="
			  								/* position: absolute; */
			  								/* left: 0; */
			  								">
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
		  </div>
		</van-tab>
      </van-tabs>
    </div>
	
	
  </div>
  </div>
  <!-- <transition name="left">
    <play-list-message
      class="play-list"
      ref="playListMessage"
      v-show="showPlayList"
	  @loadData="loaData"
      @close="showPlayList=false;"></play-list-message>
  </transition> -->
</v-touch>
</template>

<script>
import PlayListMessage from '@/components/PlayList/PlayListMessage'
import { mapGetters, mapMutations } from 'vuex'
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
      category: [],
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  token: 'Bearer ' + localStorage.token,
	  option1: [
	    { text: '全部类型', value: 0 },
	    { text: '漫画', value: 2 },
	    { text: '视频', value: 4 },
		{ text: '演员', value: 6 },
		{ text: '作品', value: 7 },
		// { text: '作品', value: 3 }
	  ],
	  // value1: 0,
	  showPlayList:false,
	  loadMode:0,
	  curScroll:{}
    };
  },
  components: {
    NavBar,
    cover,
	backTop,
	PlayListMessage
  },
  activated() {

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
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
  	if(from.name == 'collection'){
  		this.recordScroll();
  	}
   next();
  },
  methods: {
	  ...mapMutations([
	    'SET_PLAYLIST_MESSAGE',
	    'CLEAN_PLAYLIST_MESSAGE',
	    'APPEND_PLAYLIST_MESSAGE',
	    'SET_MESSAGE_TOTAL_NUM'
	  ]),
	  loaData(){
		console.log('到最后了》。。。。')  
	  },
	  returnPage(){
	  	// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  	// alert('漫画高度' + this.curScroll)
	  	this.$router.go(-1)
	  },
	  onSwipeLeft(){
		  
	  },
	  onSwipeRight(){
		  
	  },
	  // 图片加载结束
	  imgLoad(e){
	  	if(this.$refs['workImage'][e]){
	  		this.$refs['workImage'][e].$refs.image.style.objectPosition = 'top';
	  	}
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
	  onConfirm1(e){
		  // if(e == 0){
			 //  this.loadMode = ''
		  // }
		  // if(e == 1){
			 //  this.loadMode = '2'
		  // }
		  // if(e == 2){
			 //  this.loadMode = '4'
		  // }
		  this.loadMode = e
		  const categoryitem = this.categoryItem();
		  categoryitem.list = [];
		  categoryitem.page = 1;
		  categoryitem.finished = false;
		  categoryitem.loading = true;
		  this.selectArticle()
	  },
    onScroll(){

    },
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // const menu = [{DICT_NAME:'收藏'}/*,{DICT_NAME:'历史'}*//*,{DICT_NAME:'评论'}*/]
	  const menu = [{DICT_NAME:'漫画',value:'2'},{DICT_NAME:'视频',value:'4'},{DICT_NAME:'演员',value:'6'},{DICT_NAME:'作品',value:'7'}]
      this.category = this.changeCategory(menu);
      this.selectArticle();
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
    async selectArticle() {
      const categoryitem = this.categoryItem();
	  let res = [];
      // if(categoryitem.DICT_NAME == '收藏'){
        // console.log(categoryitem)
        res = await this.$http.post("/collection/queryCollectionByUserid", {
          // typeId: categoryitem.CODE_VALUE,
          pageNum: categoryitem.page,
          pageSize: categoryitem.pagesize,
          // search: ''
		  loadMode: categoryitem.loadMode
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
	  
	  
      if(categoryitem.DICT_NAME == '评论'){
        categoryitem.loading = false;
        if(res.data.data.list == 0){
          categoryitem.finished = true;
        }
      }

    },
	// 页面跳转
	toPage(detailitem,index){
		console.log(detailitem)
		console.log('下标' + index)
		// 视频页面
		if(detailitem.loadMode == 4){
			// const categoryitem = this.categoryItem();
			// console.log(this.categoryItem())
			// this.showPlayList = true
			// // this.CLEAN_PLAYLIST_MESSAGE()
			// this.SET_PLAYLIST_MESSAGE(this.categoryItem().list)
			// this.$refs.playListMessage.scrollToIndex(index)
			
		  // if(this.$route.path != `/article/${detailitem.id}/${detailitem.loadMode}`) {
		      this.$router.push(`/article/${detailitem.ljid}/${detailitem.loadMode}`)
		  // }
		}
		// 漫画页面
		if(detailitem.loadMode == 2){
			this.$router.push(`/manga/${detailitem.ljid}`)
		}
		// 漫画明细页面
		if(detailitem.loadMode == 5){
		    this.$router.push(`/mangaDetail/${detailitem.id}/${detailitem.pxh}`)
		}
		//  人员
		if(detailitem.loadMode == 6){
			// 判断是91的还是女优,跳转不同页面
			if(detailitem.personLabel == 'avperformer_avfemale'){
				this.$router.push(`/person/${detailitem.ljid}/SEX`)
			}
			if(detailitem.personLabel == 'avperformer_91'){
				this.$router.push('/videoUserInfo/' + detailitem.ljid + '/SEX/video')
			}
		    
		}
		// 作品
		if(detailitem.loadMode == 7){
		    this.$router.push(`/personWork/${detailitem.ljid}`)
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
	  $route(to,from) {
	  	// 跳转高度
	  	if(to.name == 'collection'){
	  		this.$nextTick(()=>{
	  				this.toBeforeScroll()
	  		})
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
  }
};
</script>

<style lang="less">
.home {
	width:100%;
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
.van-card__num{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 0;
}
.van-card__title {
    max-height: 32px;
    font-weight: 500;
    line-height: 16px;
	// left:1rem;
	text-align: initial;
	position: absolute;
}
.van-card__thumb{
	position: relative;
	-webkit-box-flex: 0;
	-webkit-flex: none;
	flex: none;
	width: 142px;
	height: 105px;
	margin-right: 8px;
}
.van-card__type{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
		 // left: 1rem; 
		bottom: 1.5rem;
		right: 0;
}
.van-card__chat{
	max-height: 20px;
	color: #646566;
	line-height: 20px;
	position: absolute;
	left: 3.5rem; 
	bottom: 0;
}
</style>
