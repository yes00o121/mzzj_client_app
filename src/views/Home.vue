<template>
  <div class="home" v-if="category">
	  <van-sticky>
    <nav-bar></nav-bar>
	</van-sticky>
	<!-- home -->
    <div class="categorytab"  v-show="tabActive == 0">
		
      <!-- <div class="category-ico" @click="$router.push('/editcategory')"><van-icon name="setting-o" /></div> -->
      <van-tabs v-model="active" swipeable sticky  animated offset-top="40">
        <van-tab v-for="(item,index) in category" :key="index" :title="item.DICT_NAME" scrollspy  >
			<van-sticky>
				<person-search-tool :show = "categoryItem().CODE_VALUE == '9'" @search = "personSearch"></person-search-tool>
			</van-sticky>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			  
			  <!-- <van-swipe :autoplay="3000">
			    <van-swipe-item v-for="(image, index) in item.flowData" :key="index" :loop="false" :width="300">
				  <van-image
				    width="22rem"
				    height="18rem"
				    fit="cover"
				    :src="baseURL +   image.previewImg + '&token=' + token" rel="external nofollow" 
				  >
					
				  </van-image>
				  <div class="swipe-text van-ellipsis">
					  {{image.title}}
				  </div>
			    </van-swipe-item>
			  </van-swipe> -->
			  <!-- <van-grid :border="false" :column-num="5">
			    <van-grid-item v-for="(image, index) in item.flowData" :key="index">
					<van-image
					  width="3.5rem"
					  height="2rem"
					  fit="cover"
					  scale-down="contain"
					  :src="baseURL +   image.previewImg + '&token=' + token" rel="external nofollow" 
					/> -->
			    <!-- </van-grid-item> -->
			   <!-- <van-grid-item>
			      <van-image src="https://img.yzcdn.cn/vant/apple-2.jpg" rel="external nofollow"  />
			    </van-grid-item>
			    <van-grid-item>
			      <van-image src="https://img.yzcdn.cn/vant/apple-3.jpg" rel="external nofollow"  />
			    </van-grid-item>
				<van-grid-item>
				  <van-image src="https://img.yzcdn.cn/vant/apple-3.jpg" rel="external nofollow"  />
				</van-grid-item> -->
			  <!-- </van-grid> -->
			 
            <van-list 
			  style="padding-bottom: 20%;"
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
                  
                />
              </div>
			  
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
	  <!-- <shortvideo v-if="active == 1 && videoStatus"></shortvideo>ss -->
    </div>
	<!-- <div v-if="tabActive == 2" style="heihgt:800px">
		<video controls :src="'http://192.168.1.4:8090/video/' + curVideo"></video>
			  <div v-for="item in videoList">
				  <van-button type="info" @click="curVideo = item">{{item}}</van-button>
			  </div>
	</div> -->
	<keep-alive >
	<userinfo v-if="tabActive == 3"></userinfo>
	</keep-alive >
	<dynamic v-if="tabActive == 2"></dynamic>
	<keep-alive >
		<hot v-if="tabActive == 1"></hot>
	</keep-alive >
	<van-tabbar
	  v-model="tabActive"
	  active-color="#07c160"
	  inactive-color="#000"
	  v-show="tabbarStatus"
	>
	  <van-tabbar-item icon="home-o" @click="home">首页</van-tabbar-item>
	  <van-tabbar-item icon="fire-o" @click="hit">热门</van-tabbar-item>
	  
	  <van-tabbar-item icon="underway-o"  :info="dynamicNum" @click="dynamic">动态</van-tabbar-item>
	  <van-tabbar-item icon="user-o" @click="my">我的</van-tabbar-item>
	  <!-- <van-tabbar-item icon="underway-o" v-show="dynamicNum >0" :info="dynamicNum" @click="dynamic">动态</van-tabbar-item> -->
	</van-tabbar>
	
  </div>
</template>	

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "./cover";
import dynamic from "./dynamic"
import userinfo from './userinfo'
// import shortvideo from './video'
import hot from './hot'
import personSearchTool from '@/components/personSearchTool'
export default {
  data() {
    return {
	    personParams:{},// 人员参数
		result: ['a', 'b'],
		images: [
		        'https://img.yzcdn.cn/vant/apple-1.jpg',
		        'https://img.yzcdn.cn/vant/apple-2.jpg'
		      ],
		token: 'Bearer ' + localStorage.token,
	  curScroll:0,
		curVideo:'',
	  curTableHeight:0, // 当前table高度
	  tabbarStatus:true, // 底部菜单是否显示
	  dynamicNum:null, // 动态数量
      category: [],
	  tabActive:0,// 底部菜单
	  beforetabActive:0,// 之前选中的底部
      active: 0,
      isLoading: false,   //是否处于下拉刷新状态
	  websocket:null,
	  videoStatus:true, // 视频状态,用于子组件刷新
	  normalHead:{
		  height:'auto'
	  },
	  videoHead:{
		  height:'400px',
	  },
	  accountName: '筛选',
      licensePlate: '车牌号',
      debt: '是否欠款',
      accountNameValue: '',
      licensePlateValue: '',
      debtValue: '',
      accountNameOptions: [
        { text: '全部', value: 0 },
        { text: '测试账户1', value: 1 },
        { text: '测试账户2', value: 2 },
      ],
      licensePlateOptions: [
        { text: '全部', value: 0 },
        { text: '皖A78956', value: 1 },
        { text: '皖A75236', value: 2 },
      ],
      debtOptions: [
        { text: '不限', value: 0 },
        { text: '是', value: 1 },
        { text: '否', value: 2 },
      ],

    };
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	  // console.log('跳转其他页面.......' + this.curScroll)
	  // 跳转其他页面的时候记录当前滚动高度
	  this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  // alert('跳转页面记录高度' + this.curScroll)
	  next()
  },
  beforeRouteEnter(to, from,next){
	  // console.log(to)
	  // console.log(from)
	  // let path = from.path
	  // // 关闭漫画目录页面缓存
	  // if(path.startsWith('/manga/')){
		 //  console.log('关闭漫画缓存。。。。')
		 //  from.meta.keepalive = false; 
		 //  // to.meta.keepalive = false; 
	  // } 
	  next()
  },
  components: {
    NavBar,
    cover,
	userinfo,
	dynamic,
	hot,
	personSearchTool
	// shortvideo
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
	if(this.tabActive == 0){
		this.$nextTick(()=>{
			// alert('首页高度....' + this.curScroll)
			scroll(0,this.curScroll)
		})
	}
	// const scrollTop = this.$route.meta.scrollTop;
	//     const $content = document.querySelector('.content');
	//     if (scrollTop && $content) {
	//       $content.scrollTop = scrollTop;
	//     }
  },
  methods: {
	  openMenu(index){
		   // $('.van-dropdown-item--down').css('top','50px')
		   // 动态调整下拉菜单位置、为index*高度
		   // if(index == 0){
			  //  return;
		   // }
		   // $('#down_1 .van-dropdown-item--down').css('marginLet', this.windowWidth + 'px')
		   
		   
	  },
	  toggleAccountName(value) {
	        this.accountName = this.accountNameOptions[value].text
	        this.accountNameValue = value
	      },
	      toggleLicensePlate(value) {
	        this.licensePlate = this.licensePlateOptions[value].text
	        this.licensePlateValue = value
	      },
	      toggleDebt(value) {
	        this.debt = this.debtOptions[value].text
	        this.debtValue = value
	      },
	  searchChange(){
		console.log('....')  
	  },
	  hit(){
		  this.beforetabActive = this.tabActive 
		  // this.$msg('功能开发中')
	  },
	  dynamic(){
		  this.beforetabActive = this.tabActive 
		  this.$msg('功能开发中')
	  },
	  my(){
		  this.beforetabActive = this.tabActive
		  // this.$msg('功能开发中')
	  },
    onScroll(){

    },
	home(){
		if(this.tabActive == 0 && this.beforetabActive == 0){
			scrollTo(0,0)
			this.isLoading = true
			this.onRefresh()
		}
		this.beforetabActive = this.tabActive
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  // 临时视频开始
	  this.videoList = []
	   const res1 = await this.$http.get("/webInfoDetailData/queryVideoRandom");
	  		// console.log(res1)
	  this.videoList = res1.data
	  // 临时视频结束
	  // console.log(this.videoList)
      const res = await this.$http.get("/webInfoDetailData/queryMenu",{timeout:this.httpTimeout});
	  // console.log(res)
      this.category = this.changeCategory(res.data.data);
      this.selectArticle();
    },
    changeCategory(data) {
		// const res = this.$http.get("/webInfoDetailData/queryVideoRandom");
		// console.log(res)
		
      const category1 = data.map((item, index) => {
        // console.log(item)
        item.list = [];
        item.page = 1;
        item.finished = false;
        item.loading = true;
        item.pagesize = 20;
		// console.log(item)
		// if(item.CODE_VALUE == 8){
		// 	// 初始化的时候追加热门数据
		// 	this.$http.post("/ranking/queryLatelyFlowData", {
		// 		dataType: 2
		// 	}).then(res=>{
		// 		// console.log(res)
		// 		item.flowData = res.data.data
		// 	})
			
		// }
		
        return item;
      });
      return category1;
    },
	// 查询人员数据
	async selectPerson(){
		const categoryitem = this.categoryItem();
		const res = await this.$http.post("/person/queryPerson", Object.assign({
			pageNum: categoryitem.page,
			pageSize: categoryitem.pagesize,
			personType:'SEX'
		},this.personParams))
		// console.log(res)
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
			res.data.data.list[i].previewImg = encodeURI('/video/person/' + res.data.data.list[i].person_nationality + '/' + res.data.data.list[i].person_name +'/head.jpg') + '?token=' + this.token
			res.data.data.list[i].title = res.data.data.list[i].person_name
			res.data.data.list[i].descript = ''
			// if(res.data.data.list[i].person_birthday){
			// 	res.data.data.list[i].descript += '生日：' + res.data.data.list[i].person_birthday
			// }
			// if(res.data.data.list[i].person_cup){
			// 	res.data.data.list[i].descript += '罩杯：' + res.data.data.list[i].person_cup
			// }
		}
		// console.log(res)
		categoryitem.list.push(...res.data.data.list);
		categoryitem.loading = false;
		if (res.data.data.list.length < categoryitem.pagesize) {
			categoryitem.loading = true;
		  categoryitem.finished = true;
		}
	},
	
    async selectArticle() {
      const categoryitem = this.categoryItem();
		// 如果categoryitem.CODE_VALUE等于9,但是查询女优数据
		if(categoryitem.CODE_VALUE == 9){
			console.log('??????')
			// const res = await this.$http.post("/person/queryPerson", {
			  // pageNum: categoryitem.page,
			  // pageSize: categoryitem.pagesize,
			  // personType:'SEX'
			// })
			// // console.log(res)
			// for(let i =0;i<res.data.data.list.length;i++){
			// 	res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
			// 	// res.data.data.list[i].previewImg = encodeURI('/video/person/' + res.data.data.list[i].person_nationality + '/' + res.data.data.list[i].person_name +'/head.jpg') + '?token=' + this.token
			// 	res.data.data.list[i].title = res.data.data.list[i].person_name
			// 	res.data.data.list[i].descript = ''
			// 	// if(res.data.data.list[i].person_birthday){
			// 	// 	res.data.data.list[i].descript += '生日：' + res.data.data.list[i].person_birthday
			// 	// }
			// 	// if(res.data.data.list[i].person_cup){
			// 	// 	res.data.data.list[i].descript += '罩杯：' + res.data.data.list[i].person_cup
			// 	// }
			// }
			// // console.log(res)
			// categoryitem.list.push(...res.data.data.list);
			// categoryitem.loading = false;
			// if (res.data.length < categoryitem.pagesize) {
			//   categoryitem.finished = true;
			// }
			this.selectPerson(this.personParams)
			return;
		}
		if(categoryitem.CODE_VALUE != 5){
			const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			  typeId: categoryitem.CODE_VALUE,
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  search: ''
			})
			
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.length < categoryitem.pagesize) {
			  categoryitem.loading = true;
			  categoryitem.finished = true;
			}
		}
		if(categoryitem.CODE_VALUE == 5){
			// 请求视频
			const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			  // typeId: categoryitem.CODE_VALUE,
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  loadMode:'6',
			  search: ''
			})
			for(let i =0;i< res.data.data.list.length;i++){
				let videoAddress =  res.data.data.list[i].videoAddress
				// res.data.data.list[i].previewImg = res.data.data.list[i].videoAddress''
				let length = videoAddress.lastIndexOf('/')
				videoAddress = videoAddress.substring(0,length)
				let length2  = videoAddress.lastIndexOf('/')
				videoAddress = videoAddress.substring(0,length2 + 1)
				res.data.data.list[i].previewImg = '/video/' + videoAddress + 'cover.jpg?'
				// console.log(res.data.data.list[i].previewImg)
			}
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.length < categoryitem.pagesize) {
			  categoryitem.loading = true;
			  categoryitem.finished = true;
			}
		}
       
		// console.log(this.category)
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
	// 记录列表滚动位置
    recordScroll(active){
		const categoryitem = this.category[active];
		
		let rect = document.body.getBoundingClientRect()
		categoryitem.scroll = Math.abs(rect.top)
	},
	personSearch(params){
		console.log('人员查询.....')
		const categoryitem = this.categoryItem();
		categoryitem.page = 1
		categoryitem.pagesize = 20 
		categoryitem.list = []
		categoryitem.finished = false;
		this.personParams = params
		this.selectPerson()
	}
  },
  watch: {
    active(current,before) {
      const categoryitem = this.categoryItem();
	  // 切换时候记录之前位置

      if (!categoryitem.list.length) {
        this.selectArticle();
      //   // this.$refs.tab.scrollTop = this.$refs.tab.$refs.wrapper.scrollTop;
      }
	  // 定位指定位置
	 //  if(categoryitem.scroll){
	 //  	// console.log('开始定位...' + categoryitem.scroll)
		// setTimeout(()=>{
		// 	scrollTo(0,categoryitem.scroll)
		// },50)
	  	
	 //  }
    },
	tabActive(cur){
		this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// if(cur != 0){
		// 	// console.log('记录高度。。。。。。。。。。。。。。。。。。' + (document.documentElement.scrollTop ))
		// 	this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
		// 	// alert('首页高度' + this.curScroll)
		// }else{
		// 	if(this.curScroll > 0){
		// 		this.$nextTick(()=>{
		// 			// alert('首页高度....' + this.curScroll)
		// 			scroll(0,this.curScroll)
		// 		})
		// 	} else {
		// 		scroll(0,0)
		// 	}
		// }
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
</style>
