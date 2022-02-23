<template>
  <div class="home" >
	  <van-sticky>
    <nav-bar></nav-bar>
	</van-sticky>
	<!-- home -->
    <div class="categorytab"  v-show="tabActive == 0" >
		<back-top :showHeight="300" ref="backtop"></back-top>
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
				<back-top :showHeight="100"></back-top>
			<van-sticky>
				<person-search-tool :show = "categoryItem().CODE_VALUE == '9'" @search = "personSearch"></person-search-tool>
			</van-sticky>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
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
              <div class="detailparent" ref="tab" v-show="item.CODE_VALUE != 2">	
                <cover
                  class="detailitem"
                  :detailitem="categoryitem"
                  v-for="(categoryitem,categoryindex) in item.list"
                  
                />
              </div>
			  <!-- 国产内容，不要了，注释 -->
<!-- 			  <div class="detailparent" ref="tab" v-show="item.CODE_VALUE == 2">
			  				 <div v-for="(categoryitem,categoryindex) in item.list" :key="categoryindex" style="margin:.2rem 1rem 1rem 1rem;width:100%;position: relative;">
			  					 <div style="width:100%:" @click="toPage(categoryitem)">

			  						 <div style="flex-wrap: wrap;display: flex;width:100%">
			  							 <div style="font-size:14px;text-align: left;width:100%;margin-top: 0.4rem;letter-spacing:1px;" class="van-multi-ellipsis" v-html="categoryitem.title"></div>
			  							<div style="width:35%;padding: .3rem;display: flex;width: 100%;margin-top:1rem">
			  								<van-image  v-for="(imgId,index) in categoryitem.imgs" v-if="index < 3 && imgId && imgId != ','" style="width:100%;" rel="external nofollow"  fit="contain" lazy-load :src="baseURL +  '/common/image?imgId=' + imgId + '&width=150&height=200&token=' + token" class="participates-photo"  >
													<template v-slot:error>加载失败</template>
													<template v-slot:loading>
													    <van-loading type="spinner" size="20" />
													  </template>
											</van-image>
			  							</div>
			  						 </div>
			  						 <div style="float: left;position: absolute;bottom: 0.5rem;">

										 <van-tag type="primary">国产</van-tag>
			  						 </div>
			  						 <div style="float: left;position: absolute;bottom: 0.6rem;margin-left:3rem;font-size:12px;color:#8f8f94;">
			  							 {{categoryitem.flowNum ? categoryitem.flowNum : 0}}浏览
			  						 </div>
			  						 <div style="float: right;position: absolute;bottom: 0.5rem;font-size:12px;color:#8f8f94;margin-left:75%">
			  								{{categoryitem.createTime | filterTime}}
			  						 </div>
			  					 </div>
			  					 <div class="van-hairline--bottom" style="padding-top:2rem"></div>
			  				 </div>
			   </div> -->
            </van-list>
          </van-pull-refresh>
		  </div>
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
	<userinfo v-show="tabActive == 3" ref="user"></userinfo>
	</keep-alive >
	<dynamic v-show="tabActive == 2" ref="dynamic"></dynamic>
	<keep-alive >
		<hot v-show="tabActive == 1" ref="hot"></hot>
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
	  <van-tabbar-item icon="user-o" @click="my" :dot="myIconStatus">我的</van-tabbar-item>
	  <!-- <van-tabbar-item icon="underway-o" v-show="dynamicNum >0" :info="dynamicNum" @click="dynamic">动态</van-tabbar-item> -->
	</van-tabbar>
	
  </div>
</template>	

<script>
import NavBar from "@/components/common/Navbar.vue";
import cover from "./cover";
import dynamic from "./dynamic"
import userinfo from './userinfo'
import backTop from '@/components/backTop'
// import shortvideo from './video'
import hot from './hot'
import personSearchTool from '@/components/personSearchTool'
export default {
  data() {
    return {
		myIconStatus:false, // "我的图标状态"
	    personParams:{},// 人员参数
		result: ['a', 'b'],
		images: [
		        'https://img.yzcdn.cn/vant/apple-1.jpg',
		        'https://img.yzcdn.cn/vant/apple-2.jpg'
		      ],
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
	  websocket:null
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
	  		console.log(this.curScroll)
	 console.log(this.tabActive)
	  // console.log('跳转其他页面.......' + this.curScroll)
	  // 跳转其他页面的时候记录当前滚动高度
	  // this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  // console.log(this.$refs)
	  // this.curScroll['pageScroll_'+this.active] = this.$refs['pageScroll'][this.active].scrollTop
	  // console.log('跳转页面记录高度' + JSON.stringify(this.curScroll))
	  // if(this.tabActive == 0){
		 //  this.recordScroll(0)
	  // }

	  this.recordScroll(this.tabActive)
	  // this.recordScroll(2)
	  // this.recordScroll(3)
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
	personSearchTool,
	backTop
	// shortvideo
  },
  activated() {
    if(localStorage.getItem('newCat')) {
        let newCat = JSON.parse(localStorage.getItem('newCat'))
        this.category = this.changeCategory(newCat)
        this.selectArticle();
    }
	// console.log('??????')
	console.log(this.tabActive)
	// if(this.tabActive == 0){
		this.toBeforeScroll(this.tabActive)
	// }
	// this.toBeforeScroll(this.tabActive);
	// this.toBeforeScroll(1);
	// this.toBeforeScroll(2);
	// this.toBeforeScroll(3);
	// this.curScroll['pageScroll_'+this.active] = this.$refs['pageScroll'][this.active].scrollTop
	// console.log(this.curScroll['pageScroll_'+this.active])
	// this.$refs['pageScroll'][this.active].scrollTop = this.curScroll['pageScroll_'+this.active]
	
	// if(this.tabActive == 0){
	// 	this.$nextTick(()=>{
	// 		// alert('首页高度....' + this.curScroll)
	// 		scroll(0,this.curScroll)
	// 	})
	// }
	// const scrollTop = this.$route.meta.scrollTop;
	//     const $content = document.querySelector('.content');
	//     if (scrollTop && $content) {
	//       $content.scrollTop = scrollTop;
	//     }
  },
  methods: {
		toPage(item){
			// 网络资源页面
			if(item.loadMode == 9){
			  // alert('漫画')
			    this.$router.push(`/netresources/${item.id}`)
			}
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
	  scrolls(e){
		  console.log(e.target.scrollTop)
		  // if(scrollTop > 100){
			  
		  // }
		// console.log('.....')  
	  },
	  // 之前滚动位置跳转
	  toBeforeScroll(cur){
		  // if(cur== 0){
			  let pageScroll = this.$refs['pageScroll']
			  // console.log('跳转.....')
			  // console.log(pageScroll)
			  // console.log(this.curScroll)
			  if(pageScroll && cur == 0){
				  for(let i =0;i<pageScroll.length;i++){
					  pageScroll[i].scrollTop = this.pageScroll[this.$route.name + 'pageScroll_'+ i]
				  }
			  }
		  // }
			
		  if(cur == 1){
			   this.$nextTick(()=>{
					if(this.$refs.hot){
						this.$refs.hot.toBeforeScroll()
					}  
							// console.log(this.$refs.user.$refs)
			// if(this.$refs.user && this.$refs.user.$refs.article){
			// 	// console.log(this.$refs.user.$refs.article)
			// 	this.$refs.user.$refs.article.toBeforeScroll()
			// }  
			// if(this.$refs.user ){
			// 	// console.log(this.$refs.user)
			//     this.$refs.user.toBeforeScroll()
			// }
			})
		  }

	  },
	  // 记录滚动位置
	  recordScroll(cur){
		  let pageScroll = this.$refs['pageScroll']
		  if(pageScroll && cur == 0){
			  for(let i =0;i<pageScroll.length;i++){
				  this.pageScroll[this.$route.name + 'pageScroll_'+i] = pageScroll[i].scrollTop
				  
			  }
		  }
		  if(cur == 1){
			  // this.$nextTick(()=>{
				  if(this.$refs.hot){
					  this.$refs.hot.recordScroll()
				  }
				  
				  // if(this.$refs.user && this.$refs.user.$refs.article){
					 //  this.$refs.user.$refs.article.recordScroll()
				  // }
				  // if(this.$refs.user){
					 //  this.$refs.user.recordScroll()
				  // }
			  // })

		  }

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
			// scrollTo(0,0)
			// this.$refs['pageScroll'][0].scrollTop = 0;
			console.log(this.$refs.backtop)
			top.a = this.$refs
			// this.$refs['backtop'].slideTo(0)
			this.slideTo(0,this.$refs['pageScroll'][this.active],()=>{
				// this.isLoading = true
				// this.onRefresh()
			})
			// this.isLoading = true
			// this.onRefresh()
		}
		this.beforetabActive = this.tabActive
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
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
	// 查询所有作家数据
	async selectLiterati(){
		const categoryitem = this.categoryItem();
		const res = await this.$http.post("/person/queryPerson", Object.assign({
			pageNum: categoryitem.page,
			pageSize: categoryitem.pagesize,
			personType:'LITERATI'
		}))
		for(let i =0;i<res.data.data.list.length;i++){
			res.data.data.list[i].flowNum = res.data.data.list[i].person_flow_num
			// res.data.data.list[i].previewImg = encodeURI('/video/person/' + res.data.data.list[i].person_nationality + '/' + res.data.data.list[i].person_name +'/head.jpg') + '?token=' + this.token
			res.data.data.list[i].title = res.data.data.list[i].person_name
			res.data.data.list[i].descript = ''
			// if(res.data.data.list[i].person_birthday){
			// 	res.data.data.list[i].descript += '生日：' + res.data.data.list[i].person_birthday
			// }
			// if(res.data.data.list[i].person_cup){
			// 	res.data.data.list[i].descript += '罩杯：' + res.data.data.list[i].person_cup
			// }
		}
		categoryitem.list.push(...res.data.data.list);
		categoryitem.loading = false;
		if (res.data.data.list.length < categoryitem.pagesize) {
			categoryitem.loading = true;
		  categoryitem.finished = true;
		}
		// console.log(res)
	},
	
    async selectArticle() {
      const categoryitem = this.categoryItem();
		// 如果categoryitem.CODE_VALUE等于9,但是查询女优数据
		if(categoryitem.CODE_VALUE == 9){
			// console.log('??????')
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
		// 国产
		// if(categoryitem.CODE_VALUE == 2){
		// 	// this.selectLiterati();
		// 	// console.log('....')
			
		// 	return;
		// }
		if(categoryitem.CODE_VALUE != 5){
			const res = await this.$http.post("/webInfoDetailData/queryDetailDataByTypeId", {
			  typeId: categoryitem.CODE_VALUE,
			  pageNum: categoryitem.page,
			  pageSize: categoryitem.pagesize,
			  search: '',
			  loadMode:categoryitem.CODE_VALUE == 2 ? 9 : '2'
			})
			// 国产处理图片
			if(categoryitem.CODE_VALUE == 2){
				for(let i = 0;i<res.data.data.list.length;i++){
					res.data.data.list[i].imgs = []
					let imgs = res.data.data.list[i].previewImg.split(',')
					// console.log(imgs)
					for(let j =0;j<imgs.length;j++){
						res.data.data.list[i].imgs.push(imgs[j])
					}
				}
				
			}
			console.log(res.data)
			categoryitem.list.push(...res.data.data.list);
			categoryitem.loading = false;
			if (res.data.data.list.length < categoryitem.pagesize) {
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
			if (res.data.data.list.length < categoryitem.pagesize) {
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
		// console.log(this.$refs['pageScroll'][0].scrollTop)
		// top.a = this.$refs['pageScroll'][0].scrollTop
      const categoryitem = this.categoryItem();
	  console.log(categoryitem)
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
 //    recordScroll(active){
	// 	const categoryitem = this.category[active];
		
	// 	let rect = document.body.getBoundingClientRect()
	// 	categoryitem.scroll = Math.abs(rect.top)
	// },
	personSearch(params){
		// console.log('人员查询.....')
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
      // console.log('切换........')
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
	tabActive(cur,bef){
		console.log(this.pageScroll)
		console.log(cur)
		 console.log(bef)
		this.recordScroll(bef)
		this.$nextTick(()=>{
			this.toBeforeScroll(cur)
		})
		// 

		// console.log(this.curScroll)
		// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
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
</style>
