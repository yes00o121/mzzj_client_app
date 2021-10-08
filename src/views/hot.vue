<template>
  <div  v-if="category">
    <div class="categorytab">
      <van-tabs v-model="active" swipeable sticky animated >
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy >
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
			<!-- :icon="baseURL + categoryitem.imgUrl" -->
			 <!-- <div class="detailparent" ref="tab">
				 <van-swipe-cell style="width:100%">
				   <van-card
				   lazy-load
				   @click="toDetail(categoryitem)"
				   v-for="(categoryitem,categoryindex) in item.list"
				   tag="热门"
					 :price="categoryitem.flowNum"
					 currency=""
				     :title="categoryitem.title"
				     class="goods-card"
				     :thumb="baseURL + categoryitem.previewImg +'&region=true&token=' + token"
					 style="border-bottom: 1px solid #ebedf0;"
					 :desc="categoryitem.createtime | filterTime"
				   />
				 </van-swipe-cell>
			  </div> -->
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
											<van-image lazy-load :src="baseURL + categoryitem.previewImg +'&region=true&token=' + token" style="width:130px"/>
			  							</div>
			  							<div class="van-card__tag">
			  								<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex < 3" style="background:#F25D8E;color:#FEFFFF">
			  									{{categoryindex + 1}}
			  								</span>
											<!-- <span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex == 1" style="background:#CAD5DE;color:#5F95A9">
												2
											</span> -->
											<!-- <span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex == 2" style="background:#CAD5DE;color:#5F95A9">
												3
											</span> -->
											<span class="van-tag van-tag--mark van-tag--danger" v-show="categoryindex > 2" style="background:#B8C0CC;color:#FFFBFC">
												{{categoryindex + 1}}
											</span>
			  							</div>
			  						</a>
			  						<div class="van-card__content">
										
			  							<div>
											
			  								<div class="van-card__title van-multi-ellipsis--l2">
			  									{{categoryitem.title}}
			  								</div>
											<div style="position: absolute; right: 0;bottom: 1.5rem;">
							<!-- 				<span class="van-tag van-tag--plain van-tag--danger" style="margin-right: 5px;border: 1px solid red;">
											            标签
											 </span> -->
											 </div>
											<div class="van-card__type van-ellipsis">
												{{categoryitem.loadMode == 4 ? '视频' : loadMode = 2 ? '漫画' : '其他'}}
											</div>
											<div class="van-card__num van-ellipsis">
												<van-icon name="play-circle-o" size="1rem" style="top: 0.2rem;"/>
												<span style="padding-left: 0.2rem;">{{categoryitem.flowNum | filterFlowNum}} </span>
											</div>
											<div class="van-card__chat van-ellipsis">
												<van-icon name="chat-o" size="1rem" style="top: 0.2rem;"/>
												<span style="padding-left: 0.2rem;">{{categoryitem.commentNum | filterFlowNum}}</span>
											</div>
			  								<div class="van-card__desc van-ellipsis">
			  									{{categoryitem.createtime | filterTime}}
			  								</div>
											<!-- <div class="van-card__more van-ellipsis">
												<van-icon name="more-o"  style="top: 0.2rem;"  size="1rem"/>
												</div> -->
											
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
			</van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
export default {
  data() {
    return {
      category: [],
      // menu:[{id:1,DICT_NAME:'收藏'},{id:2,DICT_NAME:'评论'}],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  token: 'Bearer ' + localStorage.token,
    };
  },
  components: {
    NavBar
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
  },
  filters:{
  	filterTime(val) {
  	  if(val){
  	    // return val.split('T')[0]
		return val.substring(0,11)
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
    onScroll(){
      
    },
	toPage(detailitem){
		// 视频页面
		if(detailitem.loadMode == 4){
		  if(this.$route.path != `/article/${detailitem.id}/${detailitem.loadMode}`) {
		      this.$router.push(`/article/${detailitem.id}/${detailitem.loadMode}`)
		  }
		}
		// 漫画页面
		if(detailitem.loadMode == 2){
		  // alert('漫画')
		    this.$router.push(`/manga/${detailitem.id}`)
		}
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      // console.log(res)
      // const menu = [{DICT_NAME:'消息'},{DICT_NAME:'视频'},{DICT_NAME:'漫画'}]
	  const res = await this.$http.get("/webInfoDetailData/queryMenu",{timeout:this.httpTimeout});
	  console.log(res)
	  let all = [{
		  CODE_VALUE:'',
		  DICT_NAME:'全部',
		  ID:'23333'
	  }]
      this.category = this.changeCategory(all.concat(res.data.data));
	  console.log(this.category)
      this.selectArticle();
    },
    changeCategory(data) {
      const category1 = data.map((item, index) => {
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
	  console.log(categoryitem)
	  const res = await this.$http.post('/webInfoDetailData/queryWebDataHot',{
		  loadMode: categoryitem.CODE_MODE_TYPE,
		  pageNum: categoryitem.page,
		  pageSize: categoryitem.pagesize,
	  },{timeout:10000})
	  console.log(res)
	// const res = await this.$http.post("/message/queryMessage", {
 //          // typeId: categoryitem.CODE_VALUE,
 //          pageNum: categoryitem.page,
 //          pageSize: categoryitem.pagesize,
 //          // : ''
 //        })
        if(res.data.data.list == 0){
          categoryitem.finished = true;
          return
        }
        categoryitem.list.push(...res.data.data.list);
		categoryitem.loading = false;
		if (res.data.length < categoryitem.pagesize) {
		  categoryitem.loading = true;
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
	height: 88px;
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