<template>
<div>
	<van-sticky >
		<van-cell  style="z-index:99999;"  icon="arrow-left" :title="person.person_name"  @click="returnPage">
			<van-icon
			    slot="right-icon"
			    name="wap-home-o"
				size="1.2rem"
			    style="line-height: inherit;"
				@click.stop="$router.push('/')"
			  />
		</van-cell>
	</van-sticky>
	<back-top :showHeight="300"></back-top>
	<div class="userdetail">
	  <div>
	    <div class="user_img">
	      <img :src="baseURL + person.person_head" alt="" v-if="person.person_head"  > 
	      <img src="@/assets/nowprinting.gif" alt v-else  />
	    </div>
	    <div class="user_edit">
	      <div >
			<p>
			  <span>国籍：&nbsp;&nbsp;{{person.person_nationality | dataChkeck}}</span>
			</p>
			<p>
			  <span>出生日期：&nbsp;&nbsp;{{person.person_birthday | dataChkeck}}</span>
			</p>
			<p>
			  <span>罩杯：&nbsp;&nbsp;{{person.person_cup | dataChkeck}}</span>
			</p>
			<p>
			  <span>身高：&nbsp;&nbsp;{{person.person_height | dataChkeck}}</span>
			</p>
			<p>
			  <span>爱好：&nbsp;&nbsp;{{person.person_hobbies | dataChkeck}}</span>
			</p>
	      </div>
	      <div >
	        <!-- <div class="user_editBtn">个人资料</div> -->
			
	      </div>
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

      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <!-- <van-tabs v-model="active" swipeable sticky animated offset-top="40"> -->
	  <van-tabs v-model="active" swipeable  animated>
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
							   <van-image lazy-load :src="baseURL +   categoryitem.previewImg + '?width='+width+'&height=' + height + '&token=' + token" style="width:100%;height:55.778vw;"/>
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
							<span>&nbsp;/&nbsp;</span>
							<span>{{categoryitem.works_time}}</span>
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
		width : '',
		height:'',
		token: 'Bearer ' + localStorage.token,
	  activeNames: [],
	  person:{},
      category: [],
      // menu:[{id:1,DICT_NAME:'作品'},{id:2,DICT_NAME:'评论'}],
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
	}  
  },
  methods: {
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
		// console.log('-------')
		const categoryitem = this.categoryItem();
		if(categoryitem.DICT_NAME == '作品'){
		  const res = await this.$http.post("/person/queryPersonWork", {
		    // typeId: categoryitem.CODE_VALUE,
				  personId: this.$route.params.id,
		    pageNum: categoryitem.page,
		    pageSize: categoryitem.pagesize,
		    // search: ''
		  })
		  if(res.data.data.list == 0){
		    categoryitem.finished = true;
		    return
		  }
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].works_flow_num
			res.data.data.list[i].previewImg = '/video/person/' + encodeURI(this.person.person_nationality) + '/' + encodeURI(this.person.person_name) + '/' + res.data.data.list[i].works_number + '/' + 'cover.jpg'
			res.data.data.list[i].title = res.data.data.list[i].works_name
		}
		  categoryitem.list.push(...res.data.data.list);
		  categoryitem.loading = false;
		  if (res.data.data.list.length < categoryitem.pagesize) {
		    categoryitem.finished = true;
		  }
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
		  personType:'SEX',
		  personId: this.$route.params.id
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
		this.$router.push(`/personWork/${item.id}`)
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
    display: flex;
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
</style>
