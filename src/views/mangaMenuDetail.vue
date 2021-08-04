<template>
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div class="home">
    <div class="categorytab">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			  <!-- 顶部弹出 -->
			  <van-popup
			    style="background: black;"
			    v-model="bottom"
			    position="top"
			    :style="{ height: '5%' }">
				<div style="color:white;text-align: center;
    padding: 2%;" class="van-ellipsis">第{{$route.params.pxh}}话</div>
			  </van-popup>
		     <van-image :ref="'img' + item.pxh" :id="item.pxh" :src="baseURL + item.imgUrl" v-for="item in mangaList" @click="showpopUp()"> </van-image>
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
		  
			<van-button   style="left: -2vw;
				background: black;
				border: none;
				font-size: 1rem;top: 5.778vw;color:#cac4c4" @click="changePage('up')">上一话</van-button>
				<van-slider  v-model="value" @change="onChange" :min="1" style="top: 0vw;
				width: 50%;
				left: 26%;" />
				<van-button style="right: -80vw;
								background: black;
								border: none;
								font-size: 1rem;top: -7vw;color:#cac4c4" @click="changePage('next')">下一话</van-button>
		  </van-popup>
		  
		  </van-popup>
    </div>
  </div>
  </v-touch>
</template>

<script>
export default {
  data() {
    return {
	  value:0,
	  mangaList:[],
	  bottom:false,
      isLoading: false,   //是否处于下拉刷新状态
    };
  },
  methods: {
	  closePop(){

	  },
    onScroll(){

    },
	onSwipeLeft () {
	    // console.log('页面左滑')
	  // this.$router.go(-1)
	},
	onSwipeRight(){
	    // console.log('页面右滑')
	    this.$router.go(-1)
	},
	changePage(type){
		var pxh = parseInt(this.$route.params.pxh)
		if(pxh == 1 && type == 'up'){
			this.$msg.fail('已经是第一话')
		} else {
			// 跳转
			if(type == 'next'){
				pxh = pxh + 1
			}
			if(type == 'up'){
				pxh = pxh - 1
			}
			this.$router.push(`/mangaDetail/${this.$route.params.id}/${pxh}`)
		}
	},
	changeSlider(){
		// 获取当前滚动高度,设置进度条
		let rect = document.body.getBoundingClientRect()
		let page =  parseInt((Math.abs(rect.top)/rect.height) * 100); // 当前可视内的页数
		if(page == 0){
			return
		}
		// 修改进度条位置
		this.value = page
	},
	onChange(e){
		console.log(e)
		let page = parseInt(this.mangaList.length * (e/100))
		if(page == 0) {
			window.scrollTo(0, 0)
			return
		}
		// console.log(this.$refs)
		console.log('当前页数' + page)
		// 获取对应图片
		let ref = this.$refs['img' + page][0].$el;
		console.log(ref)
		top.a = ref
		let height = this.getOffsetTopByBody(ref)
		// let height = ref.clientHeight
		// console.log(height)
		window.scrollTo(0, height)
		// console.log(this.$refs['img' + page])
		// 定位到滚动位置
		
	},
	getOffsetTopByBody (el) {
	  let offsetTop = 0
	  while (el && el.tagName !== 'BODY') {
	    offsetTop += el.offsetTop
	    el = el.offsetParent
	  }
	  return offsetTop
	},
	showpopUp(){
		this.bottom = !this.bottom
		this.top = !this.top
	},
    async selectCategory() {
      if(localStorage.getItem('newCat')) {
        return
      }
      // 查询漫画明细
      const res = await this.$http.post('/manga/queryMangaDetailMangaMenuId',{
        webInfoMangaDetailDataId:this.$route.params.id,
		pxh:this.$route.params.pxh
      })
	  this.mangaList = res.data.data
	  this.isLoading = false
    },
    onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.selectCategory();
                }, 500);
            }
  },
  created() {
      this.selectCategory();
  },
  mounted(){

  },
  watch:{
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
</style>
