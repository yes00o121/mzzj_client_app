<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div>
  <van-search
  v-model="search"	
    show-action
    placeholder="请输入搜索关键词"
    @search="onSearch"
    @cancel="onCancel"
	autofocus="autofocus"
	ref="search"
  />
  <div >
	  <van-collapse v-model="activeNames" >
		  <van-collapse-item title="搜索历史" name="1">
			  <van-button style="margin:3px" round  hairline type="default" @click="onSearch(item.content)"  v-for="item in searchList">{{item.content}}</van-button>
		  </van-collapse-item>
	  </van-collapse>
  </div>
  <div class="categorytab">
    <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
    <van-tabs v-model="active" swipeable sticky animated>
		
      <van-tab v-for="(item,index) in category" v-if="item.CODE_VALUE != 5" :key="index" :title="item.DICT_NAME" scrollspy>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
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
      </van-tab>
    </van-tabs>
  </div>
  </div>
  </v-touch>
</template>

<script>
import cover from "./cover";
export default {
    data() {
        return {
			curScroll:0, // 滚动位置
			curPage:'',// 当前页面标识
			activeNames: ['1'],
			search:'', // 查询条件
			beforeSearch:'',// 之前查询的zhi,用于比对
            isaa:false,
			category: [],
			searchList:[],
			active: 0,
			isLoading: false,   //是否处于下拉刷新状态
        }
    },
	components: {
	  cover
	},
	// 跳转其他页面之前
	beforeRouteLeave(to, from ,next){
		// 跳转其他页面的时候记录高度
		this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		next();
	},
	// 其他页面跳转过来
	beforeRouteEnter(to, from,next){
		  next();
	},
	activated() {
	    if(this.curPage == this.$route.query.random){
	    	if(this.curScroll > 0){
	    		scroll(0,this.curScroll)
	    	}
	    	return;
	    }
		this.showloading()
		this.curScroll = 0 // 不是相同页面,重置高度
		if(this.curPage){
			this.search = ''
			this.category = [];
			this.searchList = []
			this.onSearchRecord()
			this.selectCategory();
		}
		this.curPage = this.$route.query.random // 当前页面设置为该id
		this.hideloading();
	},
	methods: {
		
		onSwipeLeft () {
		    // console.log('页面左滑')
		  // this.$router.go(-1)
		},
		onSwipeRight(){
		    // console.log('页面右滑')
		    this.$router.go(-1)
		},
		async onSearchRecord(){
			// 获取用户搜索记录
			const res = await this.$http.get('/search/queryUserSearch?limit=10')

			this.searchList = res.data
			// console.log(this.searchList)
		},
		async onSearch(content) {
			if(content && this.beforeSearch != content){
				// this.this.searchList = []
				const categoryitem = this.categoryItem();
				categoryitem.list = []
				categoryitem.page = 1
				categoryitem.loading = true;
				categoryitem.finished = false
			}
			if(content == this.beforeSearch){
				return;
			}
			this.search = content;
			this.beforeSearch = this.search
			this.selectArticle()
		},
		onCancel() {
			this.$router.go(-1)
		    
		},
		// 清空查询数据
		empayQuery(){
			this.search = ''
			for(let i =0;i<this.category.length;i++){
				this.category[i].list = []
				this.category[i].page = 1
				this.category[i].finished = false;
				this.category[i].loading = false;
				this.category[i].pagesize = 10;
			}
		},
	  onScroll(){
	    // console.log('2222222222222222')
	  },
	  async selectCategory() {
	    if(localStorage.getItem('newCat')) {
	      return
	    }
	    const res = await this.$http.get("/webInfoDetailData/queryMenu");
	    this.category = this.changeCategory(res.data.data);
	    this.selectArticle();
	  },
	  changeCategory(data) {
	    const category1 = data.map((item, index) => {
	      // console.log(item)
	      item.list = [];
	      item.page = 1;
	      item.finished = false;
	      item.loading = false;
	      item.pagesize = 10;
	      return item;
	    });
	    return category1;
	  },
	  async selectArticle() {

	    const categoryitem = this.categoryItem();
		if(!this.search){
			categoryitem.finished = true;
			return;
		}else {
			categoryitem.finished = false;
		}
		
		
			// 如果categoryitem.CODE_VALUE等于9,但是查询女优数据
			if(categoryitem.CODE_VALUE == 9){
				const res = await this.$http.post("/person/queryPerson", {
				  pageNum: categoryitem.page,
				  pageSize: categoryitem.pagesize,
				  personType:'SEX'
				})
				for(let i =0;i<res.data.data.list.length;i++){
					res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
					res.data.data.list[i].previewImg = '/common/image?imgId=' + res.data.data.list[i].person_photp
					res.data.data.list[i].title = res.data.data.list[i].person_name
				}
				// console.log(res)
				categoryitem.list.push(...res.data.data.list);
				categoryitem.loading = false;
				if (res.data.length < categoryitem.pagesize) {
				  categoryitem.finished = true;
				}
			}else{
				const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
				  typeId: categoryitem.CODE_VALUE,
				  pageNum: categoryitem.page,
				  pageSize: categoryitem.pagesize,
				  search: this.search
				})
				
				categoryitem.list.push(...res.data.data.list);
				categoryitem.loading = false;
				// console.log(res.data.data.list.length)
				// console.log(categoryitem.pagesize)
				if (res.data.data.list.length < categoryitem.pagesize) {
					// console.log('没了。。。')
				  categoryitem.loading = true;
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
	  
		// 记录列表滚动位置
	 //  recordScroll(active){
		// 	const categoryitem = this.category[active];
			
		// 	let rect = document.body.getBoundingClientRect()
		// 	categoryitem.scroll = Math.abs(rect.top)
		// }
	},
	created() {
		console.log('页面重新加载......................')
		this.showloading()
		this.onSearchRecord()
	    this.selectCategory();
		this.hideloading()
	}
}
</script>

<style lang="less">
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
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
	border-width:inherit;
}

.van-button--hairline::after{
	border-color:white
}
.van-button::before{
	// border-color:black;
	border-color:white;
	background-color:white;
}
input[type='button']:enabled:active, input[type='button'].mui-active:enabled, input[type='submit']:enabled:active, input[type='submit'].mui-active:enabled, input[type='reset']:enabled:active, input[type='reset'].mui-active:enabled, button:enabled:active, button.mui-active:enabled, .mui-btn:enabled:active, .mui-btn.mui-active:enabled{
	color:white;
	background-color:white
}

</style>