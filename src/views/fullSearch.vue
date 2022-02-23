<template>
<div style="width:100%">
	<van-sticky style="position: fixed;width:100%;z-index:999;">
		<van-cell  style="z-index:999;"  icon="arrow-left" title="全文检索"  @click="returnPage">
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
	<van-sticky offset-top="44">
		<van-search

		v-model="search"	
		  show-action
		  placeholder="请输入搜索关键词"
		  @search="onSearch"
		  @cancel="onCancel"
			autofocus="autofocus"
			ref="search"
		/>
		<div>
			<van-dropdown-menu>
			  <van-dropdown-item :value="value1" :options="option1" @change="onConfirm1" />
			  <van-dropdown-item :value="value2" :options="option2" @change="onConfirm2" />
			  <!-- <van-dropdown-item id="item" title="测试">
			    <van-cell title="hhh">
			      <van-switch
			        slot="right-icon"
			        size="24px"
			        style="height: 26px"
			        :checked="switch1"
			        bind:change="onSwitch1Change"
			      />
			    </van-cell> -->
			   <!-- <van-cell title="{{ switchTitle2 }}">
			      <van-switch
			        slot="right-icon"
			        size="24px"
			        style="height: 26px"
			        checked="{{ switch2 }}"
			        bind:change="onSwitch2Change"
			      />
			    </van-cell> -->
			  <!--  <van-button type="info" block bind:click="onConfirm">
			      确定
			    </van-button>
			  </van-dropdown-item> -->
			</van-dropdown-menu>
		</div>
	</van-sticky>
	<back-top :showHeight="300" ref="backtop"></back-top>

  <div class="home" v-if="category">
    <div class="categorytab">

      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <!-- <van-tabs v-model="active" swipeable sticky animated offset-top="40"> -->
	  <!-- <van-tabs v-model="active" swipeable  animated> -->
	  <!-- <van-tabs v-model="active"  animated>
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy> -->
		<div v-for="(item,index) in category" :key="index">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
             <div class="detailparent" ref="tab" style="margin-top: 3rem;">
				 <div v-if="total" style="text-align:center;width:100%;font-size:14px;margin-bottom:1rem;margin-top:1rem;">
				 	<div>
						找到{{total}}项符合内容
					</div>
				 </div>
				 <!-- 演员 -->
				 <div style="display: flex;overflow: auto;" >
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

				 <div v-for="(categoryitem,categoryindex) in item.list" :key="categoryindex" style="margin:.2rem 1rem 1rem 1rem;width:100%;position: relative;">
					<!-- 作品页面 -->
					 <div style="width:100%:" @click="toPage(categoryitem)">
						 <!-- <div style="font-size:1rem;text-align: left;" class="van-multi-ellipsis--l2" v-html="categoryitem.title">
						 						 
						 </div> -->
						 
						 <div style="flex-wrap: wrap;display: flex;width:100%">
							 <div style="font-size:14px;text-align: left;width:60%;margin-top: 0.4rem;" class="van-multi-ellipsis" v-html="categoryitem.title"></div>
							<div style="width:35%;padding: .3rem;">
								<van-image  style="width:100%;height:25.778vw;" rel="external nofollow"  fit="contain" lazy-load :src="baseURL +  categoryitem.photo + (categoryitem.photo.indexOf('?') != -1 ? '&' : '?') + 'token=' + token" class="participates-photo"  >
									<template v-slot:error>加载失败</template>
											<template v-slot:loading>
											    <van-loading type="spinner" size="20" />
											  </template>
									</van-image>
								<!-- <van-image style="width:100%;height:45.778vw;" rel="external nofollow"  fit="cover" lazy-load :src="baseURL +   categoryitem.photo + '?token=' + token" class="participates-photo" v-if="categoryitem.mklx != 'video'" /> -->
							</div>
							<!-- <div class="right-descript van-multi-ellipsis--l2" v-html="categoryitem.summary">

							</div> -->
						 </div>
						 <div style="float: left;position: absolute;bottom: 2rem;">
							 <van-tag type="primary">{{categoryitem.typeName}}</van-tag>
						 </div>
						 <div style="float: left;position: absolute;bottom: 2.1rem;margin-left:3rem;font-size:12px;color:#8f8f94;">
							 {{categoryitem.flowNum}}浏览
							 <!-- <van-tag type="primary">{{categoryitem.typeName}}</van-tag> -->
						 </div>
						 <div style="float: left;position: absolute;bottom: 2.1rem;font-size:12px;color:#8f8f94;margin-left:6rem">
								{{categoryitem.createdate | filterTime}}
						 </div>
					 </div>
					 <div class="van-hairline--bottom" style="padding-top:2rem"></div>
				 </div>
              </div>
            </van-list>
          </van-pull-refresh>
		  </div>
<!--        </van-tab>
      </van-tabs> -->
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
		total:0,// 查询条数
		person:[],// 人员数组
		search:'',// 搜索条件
		mklx:'person,works,manga,video',// 模块类型
		sort:'',// 排序字段
		sortWay:'', // 排序方式
		width : '',
		height:'',
		dateType:'5',
		token: 'Bearer ' + localStorage.token,
		currentScroll:0,// 当前滚动高度
      category: [],
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	      option1: [
	        { text: '全部类型', value: 0 },
	        { text: '漫画', value: 1 },
	        { text: '视频', value: 2 },
			{ text: '作品', value: 3 }
	      ],
	      value1: 0,
		  option2: [
		    { text: '综合排序', value: 0 },
		    { text: '人气排序', value: 1 },
		    { text: '发布排序', value: 2 },
		  ],
		  value2: 0,
    };
  },
  // 跳转之前
  beforeRouteLeave(to, from, next){
	  if(from.path == '/search'){
	  
	  	this.currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
	  	this.$refs.backtop.show = false
	  	// alert('记录高度' + this.currentScroll)
	  }
	  next();
  },
  watch:{
  	$route(to,from) {
		// console.log(to)
		// console.log(from)
		// 跳转高度
		if(to.path == '/search'){
			document.documentElement.scrollTop = this.currentScroll
			document.body.scrollTop = this.currentScroll
			if(this.currentScroll >= 300){
				this.$refs.backtop.show = true
			}
			// alert('跳转高度' + this.currentScroll)
		}
		// 记录高度
		// if(from.path == '/search'){

		// 	this.currentScroll = document.documentElement.scrollTop;
			
		// 	console.log('记录高度')
		// }
        // 跳转明细页面不刷新
	 //    if(to.path.startsWith('/personWork')){
		// 	return;
		// }
		// // id相同不刷新
		// if(to.params.id == this.person.id){
		// 	// scroll(0,0)
		// 	return;
		// }
		// // console.log(from)
		// // 跳转其他页面
		// if(!to.path.startsWith('/person')){
		// 	return;
		// }
		// alert(110)
  // 		scroll(0,0)
		// this.person = {}
		// const categoryitem = this.categoryItem();
		// categoryitem.list = []
		// categoryitem.page = 1
		// categoryitem.finished = false;
		// categoryitem.loading = true;
		// this.selectArticle();
  	}
  },
  components: {
    NavBar,
    cover,
	backTop
  },
  activated(){
	// console.log('..................' + this.$route.params)
	  // console.log(this.$route.query)
	  let search = this.$route.query.search;
	  if(search == '' || search == null){
		  return;
	  }
	  if(this.search == search || search.replace('_PLACEHOLDER_','#PLACEHOLDER#') == this.search){
		  return;
	  }
	  this.search = decodeURI(search).replace('_PLACEHOLDER_','#PLACEHOLDER#')
	  
	  // 有参数带参数进行搜索
	  this.onSearch()
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
	  onConfirm1(e) {
		  this.value1 = e
		  if(e == 0){
			  this.mklx = 'person,works,manga,video'
		  }
		  if(e == 1){
			  this.mklx = 'person,manga'
		  }
		  if(e == 2){
			  this.mklx = 'person,video'
		  }
		  if(e == 3){
			  this.mklx = 'person,works'
		  }
		  this.onSearch();
	 },
	 onConfirm2(e) {
		  this.value2 = e
		  if(e == 0){
			  this.sort = ''
			  this.sortWay = ''
		  }
		  if(e == 1){
			  this.sort = 'flowNum'
			  this.sortWay = 'DESC'
		  }
		  if(e == 2){
			  this.sort = 'createdate'
			  this.sortWay = 'DESC'
		  }
		  this.onSearch();
	 },
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
			this.$router.push(`/person/${id}/SEX`)
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
		this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;
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
				  sort: this.sort,
				  sortWay: this.sortWay
		  })
		  this.person = res.data.data.person.data
		  this.total = res.data.data.ALL_CNT
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
