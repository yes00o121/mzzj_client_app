<template>
<div>
	<van-sticky >
		<van-cell  style="z-index:99999;"  icon="arrow-left" title="全文检索"  @click="returnPage">
			<van-icon
			    slot="right-icon"
			    name="wap-home-o"
				size="1.2rem"
			    style="line-height: inherit;"
				@click.stop="$router.push('/')"
			  />
		</van-cell>
	</van-sticky>
	<!-- 搜索栏 -->
	<van-sticky>
		<van-search

		v-model="search"	
		  show-action
		  placeholder="请输入搜索关键词"
		  @search="onSearch"
		  @cancel="onCancel"
			autofocus="autofocus"
			ref="search"
		/>
	</van-sticky>
	<back-top :showHeight="300"></back-top>

  <div class="home" v-if="category">
    <div class="categorytab">

      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <!-- <van-tabs v-model="active" swipeable sticky animated offset-top="40"> -->
	  <!-- <van-tabs v-model="active" swipeable  animated> -->
	  <van-tabs v-model="active"  animated>
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
             <div class="detailparent" ref="tab">
				 <!-- 演员 -->
				 <div style="display: flex;overflow: auto;" v-show="item.DICT_NAME == '综合' ">
					 <div  v-for="(categoryitem,categoryindex) in person" :key="categoryindex"  @click="toPage(categoryitem)">
						 
						 <div class="userdetail">
						 <!-- <div > -->
							  <div>
								<div class="user_img">
									<!-- <img :src="baseURL + categoryitem.photo + '?token=' + token" alt="" v-if="categoryitem.photo1"  > -->
								  <img :src="baseURL + categoryitem.photo + '?token=' + token" alt="" v-if="categoryitem.photo"  >
								  <img src="@/assets/nowprinting.gif" alt v-else  />
								</div>
								<div style="font-size:.9rem" v-html="categoryitem.title"></div>
							  </div>
							 
							</div>
					 </div>
				 </div>

				 <div v-for="(categoryitem,categoryindex) in item.list" :key="categoryindex" style="padding:.3rem 1rem 1rem 1rem;width:100%">
					<!-- 作品页面 -->
					 <div style="width:100%" @click="toPage(categoryitem)">
						 <div style="font-size:1rem;text-align: left;" class="van-multi-ellipsis--l2" v-html="categoryitem.title">
						 						 
						 </div>
						 <div style="flex-wrap: wrap;display: flex;width:100%">
							<div style="width:45%;padding: .3rem;">
								<van-image style="width:100%;height:45.778vw;" rel="external nofollow"  fit="cover" lazy-load :src="baseURL +   categoryitem.photo + '?token=' + token" class="participates-photo"  />
							</div>
							<div class="right-descript van-multi-ellipsis--l2" v-html="categoryitem.summary">

							</div>
						 </div>
						 <div style="font-size:14PX;color:#646566;float: right;">
								{{categoryitem.createdate | filterTime}}
						 </div>
					 </div>
				 </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
		person:[],// 人员数组
		search:'',// 搜索条件
		mklx:'person,works,manga,video',// 模块类型
		width : '',
		height:'',
		dateType:'5',
		token: 'Bearer ' + localStorage.token,
      category: [],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  watch:{
  	$route(to,from) {
        // 跳转明细页面不刷新
	    if(to.path.startsWith('/personWork')){
			return;
		}
		// id相同不刷新
		if(to.params.id == this.person.id){
			scroll(0,0)
			return;
		}
		// console.log(from)
		// 跳转其他页面
		if(!to.path.startsWith('/person')){
			return;
		}
		
  		scroll(0,0)
		this.person = {}
		const categoryitem = this.categoryItem();
		categoryitem.list = []
		categoryitem.page = 1
		categoryitem.finished = false;
		categoryitem.loading = true;
		this.selectArticle();
  	}
  },
  components: {
    NavBar,
    cover,
	backTop
  },
  filters:{
	dataChkeck(val){
		return val ? val : '暂无数据'
	}  ,
	filterTime(val) {
	  if(val){
	    return val.split('T')[0]
	  }
	  return "";
	},
  },
  methods: {
	  // 搜索
	  onSearch(content) {
		  console.log('search..')
		  if(this.search == ''){
			  this.$msg.fail('请输入搜索内容')
			  return;
		  }
		  const categoryitem = this.categoryItem();
		  // 初始化参数
		  categoryitem.list = [];
		  categoryitem.page = 1;
		  categoryitem.finished = false;
		  categoryitem.loading = true;
		  categoryitem.pagesize = 20;
		  this.loadData()
	  },
	  onCancel(){
		 console.log('chage...') 
	  },
	toPage(detailitem){
		console.log(detailitem)
		let id = ''
		if(detailitem.mklx == 'works'){
			id = detailitem.id.replace('works_','')
			this.$router.push(`/personWork/${id}`)
		}
		if(detailitem.mklx == 'person'){
			id = detailitem.id.replace('person_','')
			this.$router.push(`/person/${id}`)
		}
		if(detailitem.mklx == 'manga'){
			id = detailitem.id.replace('manga_','')
			 this.$router.push(`/manga/${id}`)
		}
		if(detailitem.mklx == 'video'){
			id = detailitem.id.replace('video_','')
			this.$router.push(`/article/${id}/4`)
		}
		
	},
	returnPage(){
		this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		this.$router.go(-1)
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
      // const res = await this.$http.get("/webInfoDetailData/queryMenu");
      // console.log(res)
      const menu = [{DICT_NAME:'综合'},/*{DICT_NAME:'女优'},{DICT_NAME:'作品'},{DICT_NAME:'漫画'}*//*,{DICT_NAME:'视频'}*/]
      this.category = this.changeCategory(menu);
	  // console.log(this.category)
	  // this.initPersonData();
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
    selectArticle() {	

	  this.loadData()
    },
	// 加载数据
	async loadData(){
		// console.log('-------')
		const categoryitem = this.categoryItem();
		if(!this.search){
			this.$msg.clear()
			categoryitem.finished = true
			return;
		}
		if(categoryitem.DICT_NAME == '综合'){
		  const res = await this.$http.post("/search/query", {
		    // typeId: categoryitem.CODE_VALUE,
				  search: this.search,
				  pageNum: categoryitem.page,
		          pageSize: categoryitem.pagesize,
				  dateType:this.dateType,
				  mklx:this.mklx,
				  
		    // search: ''
		  })
		  this.person = res.data.data.person.data
		  console.log(res)
		  if(res.data.data.list.data.length == 0){
		    categoryitem.finished = true;
		    return
		  }
		  categoryitem.list.push(...res.data.data.list.data);
		  categoryitem.loading = false;
		  if (res.data.data.list.data.length < categoryitem.pagesize) {
		    categoryitem.finished = true;
		  }
		  this.$msg.clear()
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
      console.log(categoryitem)
      return categoryitem;
    }
  },
  created() {
	  this.selectCategory()
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
.userdetail {
  background-color: white;
  padding: 2vw 3.333vw;
  > div:nth-child(1) {
    // display: flex;
    .user_img {
      margin-right: 5.556vw;
      img {
        height: 23.611vw;
        width: 23.611vw;
        border-radius: 50%;
      }
    }
    .user_edit {
      flex: 1;
      div:nth-child(1) {
        // display: flex;
        p {
			line-height: 1.2rem;
          flex: 1;
		  text-align: initial;
		  // float: left;
          display: flex;
          // justify-content: center;
          // align-items: center;
          flex-direction: column;
          font-size: 3.611vw;
          .user_text {
            color: #aaa;
          }
        }
        // p:nth-child(1),
        // p:nth-child(2) {
        //   border-right: 0.278vw solid #ccc;
        // }
      }
      div:nth-child(2) {
        padding: 0.556vw 2.778vw;
        .user_editBtn {
          border: 0.278vw solid #fb7a9f;
          padding: 0.833vw;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb7a9f;
          border-radius: 1.111vw;
        }
      }
    }
  }
  >div:nth-child(2){
      h2{
          // margin: 2.778vw 0 0.833vw 0;
          font-weight: 400;
      }
     p{
         padding: 0;
         margin: 2.778vw 0 0 0;
         color: #999;
     }
  }
}
.detailItem{
    p{
        font-size: 3.333vw;
        padding: 0.833vw 0;
    }
    .imgparent{
        position: relative;
         .bottom{
            padding: 0 2.778vw;
            margin-bottom: 1.389vw;
            position: absolute;
            bottom: 0.556vw;
            background: linear-gradient(0deg,rgba(0,0,0,.85),transparent);
            justify-content: space-between;
            color: white;
            display: flex;
            left: 0;
            right: 0;
        }
    }
}
.participates-photo{
	/* -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3); */
	width:100%;
	 height:30.778vw; 
	/* height:100%; */
	/* height:90px; */
	margin:.0rem .3rem;
	/* float:left */
}

.right-descript{
	width:45%;
	padding: .3rem;
	font-size:.6rem;
	text-align: left;
}
.right-descript  {
	/deep/ div{
		padding:.3rem;
		color:#646566;
	}
}
</style>
