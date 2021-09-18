<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
<!-- 				{{$route.params.pxh}}-----------------{{chapterList.length - 1}} -->
  <div class="home">
    <div class="categorytab">

		<van-sticky v-show="bottom" style="position: absolute;width: 100%;">
			<van-cell style="z-index:2999;background: black;color:white;opacity: 0.7;"  icon="arrow-left" :title="'第'+chapterList[this.$route.params.pxh - 1].title+'话'"  @click="$router.go(-1)"/>
		</van-sticky>

          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
		     <van-image lazy-load :ref="'img' + item.pxh" :id="item.pxh" :src="baseURL + item.imgUrl + '&width=' + width + '&token=' + token" v-for="item in mangaList" @click="showpopUp()"> </van-image>
          </van-pull-refresh>
		  <!-- 底部弹出 -->
		  <van-popup
		  style="background: black;
    opacity: 0.7;"
		    v-model="bottom"
		    position="bottom"
		    :style="{ height: '15%' }"
			@open="changeSlider"
		  >
		  <van-row  justify="space-around" style="padding-top:5%">
		    <van-col span="6" :style="$route.params.pxh == 1 ? 'color:rgb(52 52 52)' : ''" @click="changePage('up')">
				上一话
			</van-col>
		    <van-col span="12" offset="1" style="float:left;padding-top:6px" >
				<van-slider  v-model="value" @change="onChange" :min="1" style="width:90%" button-size="18" /> 
			</van-col>
		    <van-col span="4" :style="$route.params.pxh == chapterList.length  ? 'color:rgb(52 52 52)' : ''" offset="0" style="float:left" @click="changePage('next')">
				下一话
			</van-col>
		  </van-row>
		  <van-row  justify="space-around" style="padding-top:5%">
		    <van-col span="6">
		  		<span @click="collectionClick">
					<van-icon name="star-o" size="1.5rem" :class="{activeColor:collectionActive}" />
					<p>收藏</p>
				</span>
			</van-col>
			<van-col span="6" @click="" v-show="screenStatus == 1" >
				<span @click="trans('2')">
					<van-icon name="exchange" size="1.5rem" />
					<p>横屏</p>
				</span>
			</van-col>
			<van-col span="6" @click="" v-show="screenStatus == 2">
				<span @click="trans('1')">
					<van-icon name="exchange" size="1.5rem" />
					<p>竖屏</p>
				</span>
			</van-col>
			<van-col span="6"  @click="imgShow = true">
				<span>
					<van-icon name="photo-o" size="1.5rem" />
					<!-- <p>画质</p> -->
					<p v-if="item.value == imgQuality.configValue" v-for="item in actions">
						{{item.name}}
					</p>
				</span>
			</van-col>
		    <van-col span="6"  @click="selectChapter">
				<span>
		    		<van-icon name="orders-o" size="1.5rem" />
		    		<p>章节</p>
				</span>
		    </van-col>
		  </van-row>
		  </van-popup>
		  <!-- 画质选择 -->
		  <van-action-sheet v-model="imgShow" :actions="actions" @select="onSelect"  description="请选择画质"/>
		  <!-- 漫画章节窗口 -->
		  <van-popup
		  	  style="background: white;
				opacity: 1;"
		  	    v-model="chapter"
		  	    position="bottom"
		  	    :style="{ height: '65%' }"
		  		@open="changeChapter"
		  	  >
			  <van-sticky :offset-top="chapterTopSize">
				  <div style="font-size:14px;color:black;background:white;height:5%;z-index: 999;">
					  <!-- <p>全部章节({{chapterList.length}})</p> -->
					  
					  <van-row  justify="space-around" style="padding-top:5%">
						  <van-col span="1"></van-col>
							<van-col span="6">
								全部章节({{chapterList.length}})
							</van-col>
					   
						<!-- <van-col v-show="mangaMode == 1" span="3" offset="0" style="right:0;position: absolute;top:1rem" @click="changePage('next')">
							<van-icon name="shrink" size="1.2rem" />
						</van-col>
						<van-col v-show="mangaMode == 2" span="3" offset="0" style="right:0;position: absolute;top:1rem" @click="changePage('next')">
							<van-icon name="expand-o" size="1.2rem" />
						</van-col> -->
					  </van-row>
					<van-divider />
				  </div>
			  
			</van-sticky>
			 <div class="detailparent" ref="tab">
						 <van-swipe-cell style="width:100%">
						   <van-card
						   lazy-load
						   @click="changeManga(categoryitem)"
						   v-for="(categoryitem,categoryindex) in chapterList"
							 :title="categoryitem.title"
							 class="goods-card"
							 :thumb="baseURL + categoryitem.imgUrl +'&region=true&token=' + token"
							 style="border-bottom: 1px solid #ebedf0;"
							 :desc="categoryitem.createtime | filterTime"
						   />
						 </van-swipe-cell>
			  </div>
		  </van-popup>
    </div>
  </div>
  </v-touch>
</template>

<script>
export default {
  data() {
    return {
	   width:document.body.clientWidth,// 图片宽度
	  value:0, // 漫画位置滑动值
	  mangaList:[],// 漫画明细集合
	  bottom:false, // 是否显示底部工具栏
      isLoading: false,   //是否处于下拉刷新状态
	  token: 'Bearer ' + localStorage.token, // 用户token
	  collectionActive:false, // 收藏状态
	  screenStatus:'1' ,// 是否横屏1竖屏、2横屏
	  imgShow: false, // 画质选择
	  chapter:false, // 章节窗口
	  // 清晰度选择栏
	  actions: [ 
		  { name: '低',value: '0.2' },
		  { name: '中',value: '0.5' },
		  { name: '高',value: '0.8' },
		  { name: '原画',value: '1'}
		],
	  imgQuality:'',// 图片清晰度
	  chapterList:[], // 章节数据集合
	  mangaMode:'1' ,// 漫画模式,1略所模式,2列表模式
	  chapterTopSize: document.body.clientHeight * 0.35 // 章节菜单高度距离顶部距离像素
    };
  },
  filters:{
  	filterTime(val) {
  	  if(val){
  	    return val.split('T')[0]
  	  }
  	  return "";
  	},
  },
  // 跳转其他页面之前
  beforeRouteLeave(to, from ,next){
	next();  
  },
  
  beforeRouteEnter(to, from,next){
	  // let path = from.path
	  // console.log(to)
	  // console.log(from)
	  // if(path.startsWith('/manga/')){
		 //  from.meta.keepalive = true
	  // } else{
		 //  from.meta.keepalive = false
	  // }
	  // 
	  next()
  },
  methods: {
	  // 点击章节按钮
	  selectChapter(){
		  this.chapter = true
		  
	  },
	  onSelect(e){
		  // 判断选择的时候和当前的一直，一直退出,不一直修改配置信息
		 if(e.value == this.imgQuality.configValue){
			 return;
		 }
		 
		 this.imgQuality.configValue = e.value;
		 // 修改图片画质配置
		 this.changeConfig(this.imgQuality)
		 this.setCurrentImage()
		this.value = 1
	  },
	  closePop(){

	  },
	  // 打开章节窗口
	  changeChapter(){
		  
	  },
    onScroll(){

    },
	onSwipeLeft () {
	    // console.log('页面左滑')
	  // this.$router.go(-1)
	},
	onSwipeRight(){
	    // console.log('页面右滑')
		// 切换回漫画页面
		// console.log(this.$route.params.id)
		// let id = this.$route.params.id
		// this.$router.push(`/manga/${id}`)
	    // this.$router.go(-1)
	},
	trans(type){
		// 横屏、竖屏控制
		if(type == '2'){
			// this.screenStatus = type
			// this.longitudinal();
			this.transverse()
		}
		if(type == '2'){
			// this.screenStatus = '1'
			// this.transverse()
			this.longitudinal()
		}
		this.screenStatus = type
	},
	changePage(type){
		var pxh = parseInt(this.$route.params.pxh)
		if(pxh == 1 && type == 'up'){
			// this.$msg.fail('已经是第一话')
			return;
		} else {
			// 跳转
			if(type == 'next'){
				// 最后一页,不跳转
				if(this.$route.params.pxh == this.chapterList.length){
					return;
				}
				// pxh = pxh + 1
				this.$route.params.pxh = pxh + 1
			}
			if(type == 'up'){
				// pxh = pxh - 1
				this.$route.params.pxh = pxh - 1
			}
			this.value = 1;
			scrollTo(0,0)
			this.selectCategory();
		}
	},
	changeSlider(){
		// 获取当前滚动高度,设置进度条
		let rect = document.body.getBoundingClientRect()
		let height = document.body.scrollHeight // body总高度
		// let page =  parseInt((Math.abs(rect.top)/rect.height) * 100); // 当前可视内的页数
		let page =  parseInt((Math.abs(rect.top)/height) * 100); // 当前可视内的页数
		if(page == 0){
			return
		}
		// 修改进度条位置
		this.value = page
	},
	onChange(e){
		let page = parseInt(this.mangaList.length * (e/100))
		if(page == 0) {
			window.scrollTo(0, 0)
			return
		}
		// 获取对应图片
		let ref = this.$refs['img' + page][0].$el;
		let height = this.getOffsetTopByBody(ref)
		// 计算后定位到目标高度
		window.scrollTo(0, height)
		
	},
	//进入页面获取是否收藏
	async collectionInit() {
	    if(localStorage.getItem('token')){
	        const res = await this.$http.post('/collection/queryCollectionByUseridAndDetailDataId',{
	            webInfoDetailDataId:this.$route.params.id
	        })
	    this.collectionActive = res.data.data == '1' ? true : false;
	    }
	},
	async collectionClick() {
	   if(localStorage.getItem('token')){
	     // 判断显示状态,是收藏还是取消收藏
	     if(!this.collectionActive){
	       const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id})
	       // console.log(res)
	       if(res.data.data == '收藏成功'){
	           this.collectionActive = true
	       }else{
	           this.$msg.fail(res.data.message)
	       }
	     } else {
	       const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id})
	       if(res.data.data == '取消成功'){
	         this.collectionActive = false
	       } else {
	          this.$msg.fail(res.data.message)
	       }
	     }
	   }
	},
	getOffsetTopByBody (el) {
	  let offsetTop = 0
	  while (el && el.tagName !== 'BODY') {
	    offsetTop += el.offsetTop
	    el = el.offsetParent
	  }
	  return offsetTop
	},
	// 切换漫画
	changeManga(item){
		let pxh = item.pxh
		this.$route.params.pxh = pxh;
		this.value = 1;
		scrollTo(0,0)
		this.selectCategory();
	},
	showpopUp(){
		this.bottom = !this.bottom
		this.top = !this.top
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
	  this.showloading()
      // 查询漫画明细
      const res = await this.$http.post('/manga/queryMangaDetailMangaMenuId',{
        webInfoMangaDetailDataId:this.$route.params.id,
		pxh:this.$route.params.pxh
      })
	  this.mangaList = res.data.data
	  this.isLoading = false
	  this.hideloading()
    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.selectCategory();
                }, 500);
            },
	// 修改配置方法
	changeConfig(data){
		// 配置存在，走修改
		if(data.uId){
			this.$http.post('/config/updateUserConfigValueById',{
				configValue: data.configValue,
				id:data.uId
			}).then(res=>{
				if(res.data.code == 200){
					this.mangaList = []
					this.selectCategory()
				}else{
					this.$msg.fail(res.data.message)
				}
			})
		} else {
			// 配置不存在走新增
			this.$http.post('/config/insertConfigValue',{
				configId:data.id,
				configName: data.configName,
				configValue: data.configValue
			}).then(res=>{
				if(res.data.code == 200){
					this.mangaList = []
					this.selectCategory()
				}else {
					this.$msg.fail(res.data.message)
				}
			})
		}
	},
	// 设置当前选中图片
	setCurrentImage(){
		// 遍历清晰度数组,将与值相同的进行选中
		for(let i =0;i<this.actions.length;i++){
			  if(this.actions[i].value == this.imgQuality.configValue){
				  this.actions[i].color = '#1989fa'
			  }else {
				  this.actions[i].color = ''
			  }
		}
	},
	async initConfig(){
		// 获取画质配置信息
		const res = await this.$http.post('/config/queryConfigAll/',{
				  id:1
		})
		this.imgQuality = res.data[0]
	},
	async initChapter(){
		// 获取漫画章节数据
		const res = await this.$http.post('/manga/queryMangaMenuByWebInfoDataId',{
		  webInfoDataId:this.$route.params.id
		})
		this.chapterList = res.data.data
	}
  },
  created() {
	  this.initConfig();
	  this.initChapter();
	  this.selectCategory();
	  this.collectionInit();
  },	
  mounted(){

  },
  watch:{
	  imgShow(cur,bef){
		  // 打开图片清晰度,选中用户当前配置
		  if(cur){
			  this.setCurrentImage()
		  }
	  },
	  chapter(bef){
		// 当章节变成false时候,将底部菜单也一并关闭
		 if(!bef){
			 this.bottom = false
		 }
	  },
	  $route() {
		  if(this.$route.params.pxh == 1){
			  return
		  }
		  // 重新请求数据
		 this.selectCategory();
	      // this.collectionInit()
	  },
  }
};
</script>

<style lang="less" scoped>
.home {
  background-color: white;
  color:white;
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

.goods-card {
  margin: 5;
  background-color: white;
}

.delete-button {
  height: 100%;
}
.van-card__thumb{
	position: relative;
	    -webkit-box-flex: 0;
	    -webkit-flex: none;
	    flex: none;
	    width: 120px;
	    height: 80px;
	    margin-right: 20px;
}
.van-card__title{
	font-size:16px;
	
}
.van-image{
	position: relative;
	    display: block;
}
p{
	padding-top:5px;
	font-size:14px;
	color:white;
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
.detailparent {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .detailitem {
    margin: 1.389vw 0;
    width: 45%;
  }
}
.van-card__desc{
bottom: 0;
    position: absolute;
}
.van-swipe-cell{
	position: relative;
	    overflow: hidden;
	    background: white;
	    cursor: grab;
}
</style>
