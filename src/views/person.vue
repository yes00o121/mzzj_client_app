<template>
	<v-touch  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
<div>
	<van-sticky>
		<van-cell  style="z-index:999;width:100%;"  icon="arrow-left" class="van-ellipsis" :title="person.person_name ? person.person_name : ''"  @click="returnPage">
			<van-button style="margin-right:1rem" plain type="default" size="mini" @click.stop="collectionClick" :class="{activeColor:collectionActive}">
				<van-icon  name="star-o" size=".5rem" />
				<span>&nbsp;关注</span>
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
	<back-top :showHeight="300" ></back-top>
	<div class="userdetail">
	  <div>
	    <div class="user_img">
	      <img :src="baseURL + '/file/getfilestreamNvyou/' + person.id " alt="" v-if="person.person_head"  > 
	      <!-- <img src="@/assets/nowprinting.gif" alt v-else  /> -->
	    </div>
	    <div class="user_edit van-multi-ellipsis--l2" >
	      <div >
			<p v-if="person.person_nationality">
			  <span>国籍：&nbsp;&nbsp;{{person.person_nationality | dataChkeck}}</span>
			</p>
			<p v-if="person.person_birthday">
			  <span>出生日期：&nbsp;&nbsp;{{person.person_birthday | dataChkeck}}</span>
			</p>
			<p v-if="person.person_cup">
			  <span>罩杯：&nbsp;&nbsp;{{person.person_cup | dataChkeck}}</span>
			</p>
			<p v-if="person.person_height">
			  <span>身高：&nbsp;&nbsp;{{person.person_height | dataChkeck}}</span>
			</p>
			<p v-if="person.person_hobbies">
			  <span>爱好：&nbsp;&nbsp;{{person.person_hobbies | dataChkeck}}</span>
			</p>
			<!-- <div class="van-multi-ellipsis--l2"> -->
			<p v-show="person.person_introduce" style="display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;">
			  <span>作者介绍：&nbsp;&nbsp;{{person.person_introduce | dataChkeck}}</span>
			</p>
			<!-- </div> -->
	      </div>
	      <div >
	        <!-- <div class="user_editBtn">个人资料</div> -->
			
	      </div>
		 <!-- <div style="right:0;bottom:0;padding-top:1rem">
		  	<van-button plain type="default" size="mini" @click="collectionClick" :class="{activeColor:collectionActive}">
		  		<van-icon  name="star-o" size=".5rem" />
		  		<span>&nbsp;关注</span>
		  	</van-button>
		  </div> -->
	    </div>
	  </div>
	  <div>
	    <!-- <h2>{{userInfo.name}}</h2> -->
	    <!-- <p v-if="userInfo.user_desc">{{userInfo.user_desc}}</p> -->
	    <!-- <p v-else>这个人很神秘，什么都没有写</p> -->
<!-- 		<van-collapse v-model="activeNames">
		  <van-collapse-item title="更多信息" name="1">
			    <span>国籍：&nbsp;&nbsp;{{person.person_nationality}}</span>
		  </van-collapse-item>
		</van-collapse> -->
	  </div>
	</div>
  <div class="home" v-if="category">
    <div class="categorytab">
		<van-dropdown-menu style="font-size: 3.333vw">
		  <van-dropdown-item :value="loadMode"  :options="option1" @change="onConfirm1" />
		  </van-dropdown-menu>
      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <!-- <van-tabs v-model="active" swipeable sticky animated offset-top="40"> -->
	 <!-- <van-tabs v-model="active" swipeable  animated >
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy> -->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
			v-for="(item,index) in category" :key="index"
              v-model="item.loading"
              :immediate-check="false"
              :finished="item.finished"
              finished-text="我也是有底线的"
              @load="onLoad"
            >
              <div class="detailparent" ref="tab">
                <!-- <cover
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  :key="categoryindex"
                /> -->
				<div  ref="wrapper" v-for="(categoryitem,categoryindex) in item.list" :key="categoryindex"  class="detailitem" @click="pathPush(categoryitem)">
				    <div class="detailItem" >
				        <div class="imgparent">
				             <!-- <img :src="baseURL + detailitem.previewImg"  alt="" style="width:100%;height:47.778vw;"> -->
							   <van-image fit="cover" lazy-load style="height:200px" :src="baseURL +   '/file/getfilestreamNvyouMinWork/' + categoryitem.id + '?token=' + token">
								   <template v-slot:error >
									   <!-- <img src="@/assets/bk_black.png"   class="avatar" > -->
									   <div >
										   加载失败
									   </div>
								   </template>
								   		<template v-slot:loading>
								   		    <van-loading type="spinner" size="20" />
								   		  </template>
								   </van-image>
				            <div class="bottom">
				                <!-- <div class="icon-play2"><span class="video">&nbsp;{{detailitem.flowNum}}</span></div> -->
								  <div v-if="categoryitem.flowNum"><span class="video"><van-icon name="eye-o" />&nbsp;{{categoryitem.flowNum}}</span></div>
				                <!-- <div class="icon-file-text"> <span class="comment">{{!detailitem.commentlen ? 66 : detailitem.commentlen}}</span> </div> -->
				            </div>
				        </div>
				        <div class="van-multi-ellipsis--l3" style="font-size: 12px;
    color: #333;
    line-height: 1rem;">{{categoryitem.title}}</div>
						<div style="color:#c00;font-size:12px;padding-top:.3rem;text-align: left;">
							<span>{{categoryitem.works_number}}</span>
							<span v-if="categoryitem.works_number">&nbsp;/&nbsp;</span>
							<span>{{categoryitem.works_time}}</span>
						</div>
				    </div>
				</div>
              </div>
            </van-list>
          </van-pull-refresh>
    <!--    </van-tab>
      </van-tabs> -->
    </div>
  </div>
  </div>
  </v-touch>
</template>

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "@/views/cover";
import backTop from '@/components/backTop'
export default {
  data() {
    return {
		width : '',
		height:'',
		token: 'Bearer ' + localStorage.token,
	  activeNames: [],
	  person:{},
	  collectionActive:false,
      category: [],
      // menu:[{id:1,DICT_NAME:'作品'},{id:2,DICT_NAME:'评论'}],
      active: 0,
	  loadStatus:false,// 加载状态
	  currentScroll:0,// 滚动高度
      isLoading: false,   //是否处于下拉刷新状态
	  option1: [
	    { text: '全部', value: 0 },
	    { text: '单体作品', value: 1 },
	    { text: '共演作品', value: 2 }
	  		// { text: '作品', value: 3 }
	  ],
	  loadMode:0,
    };
  },
  watch:{
  	$route(to,from) {
		// console.log(to)
		// 跳转高度
		if(to.name == 'person'){
			// alert(this.currentScroll)
			this.$nextTick(()=>{
				document.documentElement.scrollTop = this.currentScroll
				document.body.scrollTop = this.currentScroll
			})
		}
		
		// id不同刷新
		if(to.name =='person' && to.params.id != this.person.id){
			scroll(0,0)
			this.loadMode = 0
			this.person = {}
			const categoryitem = this.categoryItem();
			categoryitem.list = []
			categoryitem.page = 1
			categoryitem.finished = false;
			categoryitem.loading = true;
			this.selectArticle();
			this.collectionInit()
		}
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
	}  
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
  	if(from.name == 'person'){
  		this.currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  	}
   next();
  },
  methods: {
	  onSwipeLeft () {

	  },
	  onSwipeRight(){
	  	if(localStorage.slideReturn == 1){
	  		this.$router.go(-1)
	  	}
	  },
	  onConfirm1(e){
	  		  this.loadMode = e
	  		  const categoryitem = this.categoryItem();
	  		  categoryitem.list = [];
	  		  categoryitem.page = 1;
	  		  categoryitem.finished = false;
	  		  categoryitem.loading = true;
	  		  this.selectArticle()
	  },
	  async collectionClick() {
	     if(localStorage.getItem('token')){
	       // 判断显示状态,是收藏还是取消收藏
	       if(!this.collectionActive){
	         const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'2'})
	         // console.log(res)
	         if(res.data.data == '收藏成功'){
	             this.collectionActive = true
	         }else{
	             // this.collectionActive = false
	             this.$msg.fail(res.data.message)
	         }
	       } else {
	         const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'2'})
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
	              webInfoDetailDataId:this.$route.params.id,
				  collectionType:'2'
	          })
	          // console.log(res.data)
	      this.collectionActive = res.data.data == '1' ? true : false;
		  // console.log(this.collectionActive)
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
      const menu = [{DICT_NAME:'作品'}/*,{DICT_NAME:'评论'}*/]
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
        item.pagesize = 10;
        return item;
      });
      return category1;
    },
    selectArticle() {	
	  if(!this.person.person_name){
		  this.initPersonData();
		  return;
	  }

	  this.loadData()
    },
	// 加载数据
	async loadData(){
		
		// 开始查询让点击事件失效，不然会分页冲突
		// console.log('-------')
		const categoryitem = this.categoryItem();
		if(categoryitem.DICT_NAME == '作品'){
		  const res = await this.$http.post("/person/queryPersonWork", {
				  personId: this.$route.params.id,
		    pageNum: categoryitem.page,
		    pageSize: categoryitem.pagesize,
			loadMode:this.loadMode
		  })
		  console.log(res)
		  if(res.data.data.list == 0){
		    categoryitem.finished = true;
			this.loadStatus = false
		    return
		  }
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].works_flow_num
			// res.data.data.list[i].previewImg = '/video/person/' + encodeURI(this.person.person_nationality) + '/' + encodeURI(this.person.person_name) + '/' + res.data.data.list[i].works_number + '/' + 'cover.jpg'
			res.data.data.list[i].title = res.data.data.list[i].works_name
		}
		  categoryitem.list.push(...res.data.data.list);
		  categoryitem.loading = false;
		  if (res.data.data.list.length < categoryitem.pagesize) {
		    categoryitem.finished = true;
		  }
		  this.loadStatus = false
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
		this.loadStatus = true
      const categoryitem = this.categoryItem();
	  if(categoryitem.list.length == 0){
		  this.loadStatus = false
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
	async initPersonData(){
		this.$msg.loading({
		  message: '加载中...',
		  forbidClick: true,
		  loadingType: 'spinner'
		});
		const categoryitem = this.categoryItem();
		const res = await this.$http.post("/person/queryPerson", {
		  pageNum: categoryitem.page,
		  pageSize: categoryitem.pagesize,
		  personType:this.$route.params.type,
		  personId: this.$route.params.id,
		  personLabel:'avperformer_avfemale'
		})
		if(res.data.data.list.length == 0){
			categoryitem.finished = true;
			return;
		}
		res.data.data.list[0].person_head = '/video/person/' + encodeURI(res.data.data.list[0].person_nationality) + '/' + encodeURI(res.data.data.list[0].person_name) + '/head.jpg' + '?token=' + this.token
		this.person = res.data.data.list[0]
		this.loadData()
		this.$msg.clear()
	},
	pathPush(item){
		if(this.loadStatus){
			return;
		}
		
		// 判断是否播放视频页面,不是打开明细,不然直接打开视频页面
		if(item.works_video_status == 1){
			this.$router.push(`/article/${item.id}/6`)
		}else {
			if(this.$route.params.type == 'SEX'){
				this.$router.push(`/personWork/${item.id}`)
			}
			if(this.$route.params.type == 'LITERATI'){
				this.$router.push(`/literati/${item.id}`)
			}
		}

	}
  },
  created() {
	  this.selectCategory()
	  this.collectionInit()
  }
};
</script>

<style lang="less" scoped>
p{
	display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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
.userdetail {
  background-color: white;
  padding: 2vw 3.333vw;
  > div:nth-child(1) {
    display: flex;
    .user_img {
      margin-right: 5.556vw;
      img {
        height: 23.611vw;
        width: 23.611vw;
		object-fit: cover;
		object-position: top;
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
        // padding: 0.556vw 2.778vw;
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
          margin: 2.778vw 0 0.833vw 0;
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
