<!-- 作品信息 -->
<template>
	
	<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" :style="'touch-action: pan-y!important;width:100%;height:'+windowHeight+'px'" :swipe-options="{direction: 'horizontal'}">
	<div style="background:white;" v-show="analysisData.length == 0 ">
		
		<van-sticky >
			<van-cell class="van-ellipsis"  style="width:100%"  icon="arrow-left" :title="work.works_number"  @click="returnPage">
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

		<!-- 作品数据 -->
		<div style="justify-content: space-around;flex-wrap: wrap;display: flex;padding: 0px 1rem;">
			<div>{{work.works_name}}</div>
			<!-- <div> -->
				<van-image fit="cover" :src="baseURL + work.conver + '?token=' + token" style="width:100%;height:70.778vw;margin-top:1rem" @click="bigImagePreview">
					<template v-slot:error>加载失败</template>
							<template v-slot:loading>
							    <van-loading type="spinner" size="20" />
							  </template>
					</van-image>
			<!-- </div> -->
			
		</div>
		<div>
			<van-cell-group style="text-align: initial;">
			  <van-cell title="番号" :value="work.works_number" v-if="work.works_number" />
			  <van-cell title="发布时间" :value="work.works_time" v-if="work.works_time" />
			  <van-cell title="影片时长" :value="work.works_length" v-if="work.works_length" />
			  <van-cell title="导演" :value="work.works_director_name" v-if="work.works_director_name" @click="toSearch(work.works_director_name)"/>
			  <van-cell title="发行商" :value="work.works_company" v-if="work.works_company" @click="toSearch(work.works_company)"/>
			  <van-cell title="制作商" :value="work.works_production" v-if="work.works_production" @click="toSearch(work.works_production)"/>
			  <van-cell title="系列" :value="work.works_series" v-if="work.works_series" @click="toSearch(work.works_series)"/>
			  <!-- <van-cell title="类别" :value="work.works_category" v-if="work.works_category"/> -->
			  <van-cell title="类别" v-if="work.works_category_arr">
				  <span v-for="item in work.works_category_arr">
					   <van-tag plain  type="primary" @click="toSearch(item + '_PLACEHOLDER_')">{{item}}</van-tag>
					   <span style="padding:.5rem"></span>
				  </span>
				 
				  </van-cell>
			</van-cell-group>
		</div>
		<!-- 演员数据 -->
		<div v-if="participates.length > 0" >
			<van-cell-group style="text-align: initial;">
				<van-cell title="演员" value="" />
			</van-cell-group>
			<div style="flex-wrap: wrap;display: flex;">
				<div v-for="(item,index) in participates" :key = "index" style="width:30%;padding: .3rem;" @click="pathPush(item)">
					<div>
						<van-image v-if="item.personNationality"  lazy-load :src="baseURL +   item.personNationality + '?token=' + token" class="participates-photo" >
							<template v-slot:error>
								<img  src="@/assets/nowprinting.gif" class="participates-photo">
							</template>
						</van-image>
						<img v-if="!item.personNationality" src="@/assets/nowprinting.gif" class="participates-photo">
						<div class="text">{{item.person_name}}</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="workImages.length > 0">
			<van-cell-group style="text-align: initial;">
				<van-cell title="预览图" value="" />
			</van-cell-group>
			<div style="flex-wrap: wrap;display: flex;" >
				<div v-for="(item,index) in workImages" :key = "index" style="width:45%;padding: .3rem;">
					<div>
						<van-image ref="workImage" style="width:100%;" @load="imgLoad(index)" rel="external nofollow"  fit="cover" lazy-load :src="baseURL +  item.content + '?token=' + token" class="participates-photo" @click="imagePreview(item)" >
							<template v-slot:error>加载失败</template>
									<template v-slot:loading>
									    <van-loading type="spinner" size="20" />
									  </template>
							</van-image>
					</div>
				</div>
			</div>
		</div>
		<div v-if="magnetList.length > 0">
			<van-cell-group style="text-align: initial;">
				<van-cell title="磁力" value="" />
			</van-cell-group>
			<van-cell :title="item.torrentName" v-for="(item,index) in magnetList" :key="index" v-clipboard:copy="item.magnet" v-clipboard:success="onCopy" v-clipboard:error="onError">
				<div style="margin-left: 2rem;float: left;">
					{{item.size}}
				</div>
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <!-- <van-button type="default" size="mini" v-clipboard:copy="item.magnet" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</van-button> -->
			  <van-button type="default" size="mini" @click.stop="analysis(item)">解析</van-button>
			</van-cell>
		</div>
	</div>
	<div style="z-index:9999;height:100%;width:100%;;" v-show="analysisData.length > 0 && !showVideo">
		<van-sticky >
			<van-cell class="van-ellipsis"  style="width:100%"  icon="arrow-left" title="返回"  @click="analysisData = []">
			</van-cell>
		</van-sticky>
		<van-swipe-cell style="width:100%;" initial-swipe="20" :key="categoryindex" v-for="(categoryitem,categoryindex) in analysisData">
		 <van-card v-if="categoryitem.name.indexOf('mp4') != - 1"
		  lazy-load
		  @click="openVideo(categoryitem)"
									 :title="categoryitem.name"
									 class="goods-card"
									 style="border-bottom: 1px solid #ebedf0;"
									 :desc="categoryitem.size"
		  />
		</van-swipe-cell>
	</div>
	<div v-if="showVideo" style="width:100%;height: 300px;">
		<van-sticky >
			<van-cell class="van-ellipsis"  style="width:100%"  icon="arrow-left" :title="videoItem.name"  @click="showVideo = false">
			</van-cell>
		</van-sticky>
		<!-- <video :src="'http://192.168.1.5:9000/api/torrent/serve/' +infoHash + videoItem.path + ''"  style="width:100%;height: 300px;"></video> -->
		<div class="my-video"  :style="VideoItemHeightStyle" />
		<van-button @click="screen()" style="z-index:9999">全屏</van-button>
		<van-button @click="showVideo = false" style="z-index:9999">返回</van-button>
	</div>
	</v-touch>
</template>

<script>
import Vue from 'vue';
import { ImagePreview } from 'vant';
export default{
	data(){
		return {
			work:{},
			participates:[], // 出演人员
			workImages:[],// 预览图片
			converPreviews:[],// 大图预览
			imagePreviews:[], // 预览图片查看数组
			magnetList:[],// 磁力数组
			token: 'Bearer ' + localStorage.token,
			collectionActive: false,
			showVideo:false,
			infoHash:'',// 链接hash
			analysisData:[],// 解析数据
			analysisStatus:false // 解析状态
		}
	},
	watch:{
		$route(to,from) {
			// 不管如何都置顶
			scroll(0,0)
			// 页面id不同刷新数据
			if(to.name == 'personWork' && this.work.id != this.$route.params.id){
				this.imagePreviews = []
				this.converPreviews = []// 大图预览
				this.workImages = []
				this.analysisStatus = false
				this.analysisData = []
				this.magnetList = []
				// 作品数据
				this.initPersonWorkData()
				// 演员数据
				this.initPersonWorkParticipate()
				// 预览图数据
				this.initPersonWorkImage();
				// 收藏状态
				this.collectionInit();
			}
			
		}
	},
	computed: {
		VideoItemHeightStyle () {
		  // let clientWidth = top.document.body.clientWidth
		  // let clientHeight = top.document.body.clientHeight
		  // if(this.videoHeight && this.videoHeight > 0){
			 //  clientHeight = this.videoHeight
		  // }
		  return {
		    height: '100%',
		    width: '100%'
		  }
		}
	},
	methods:{
		getVideoHtml(){
				  // visibility: hidden;
				  // console.log('销毁重新创建......')
				  let html = `<video  id="ss"  class="video"
		style="width:100%;height:100%;"
		webkit-playsinline="true" x5-video-player-type="h5-page"
		x5-playsinline  x-webkit-airplay="allow"
		x5-video-player-fullscreen="true" playsinline="true" preload="auto"
		controls="false" 
		object-fit="fill"
		></video>`;
				  $('.my-video').prepend(html)
				  return $('.my-video' + '' + ' video')[0]
				  // return '#'this.VideoItem.id
				  // console.log($('#div_' + this.VideoItem.id))
		},
		// 全屏
		screen () {
			  if (this.video.requestFullscreen) {
				  this.video.requestFullscreen();
			  } else if (this.video.mozRequestFullScreen) {
				  this.video.mozRequestFullScreen();
			  } else if (this.video.msRequestFullscreen) {
				  this.video.msRequestFullscreen();
			  } else if (this.video.oRequestFullscreen) {
				  this.video.oRequestFullscreen();
			  } else if (this.video.webkitRequestFullscreen) {
				  this.video.webkitRequestFullScreen();
			  } else {
				// 不支持全屏
				this.$msg.fail('设备不支持全屏')
				 
			  }
		},
		createVideo(){
			top.a = this
			this.$nextTick(()=>{
				this.video = this.$video(
				          // this.$refs.videoPlayer ,
							this.getVideoHtml(),
				          // this.options,
						  {
							  // autoplay: 'muted',//自动播放
				
							  loop:false,
							  controls: false,//用户可以与之交互的控件
						  },
				          function onPlayerReady() {
				
						  }
				        );
											  // top.a = this.video
				this.video.src({
						  // src:this.baseURL + '/webInfoVideo/' + nextAddress + '/' + nextAddress + '?token=' + this.token,
						  src:'http://192.168.1.130:9000/api/torrent/serve/' +this.infoHash + this.videoItem.path,
						  // type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
						})
				this.video.play()
			})

		},
		openVideo(item){
			console.log(item)
			this.videoItem = item
			this.showVideo = true
			this.createVideo()
		},
		// 解析磁力
		analysis(item){
			this.analysisStatus = true
			this.$dialog.confirm({
			   showConfirmButton:false,
			  title: ' ',
			  message: '解析中请稍等...'
			}).then(() => {
				this.analysisStatus = false
			}).catch(() => {
				
			});
			this.$http.get('http://192.168.1.130:9000/api/torrent/info?torrentId=' + item.magnet).then(res=>{
				console.log(res)
				if(this.analysisStatus){
					if(res.data.files.length == 0){
						this.$dialog.close()
						this.$msg('无法解析')
					}else{
						this.analysisData = res.data.files
						this.infoHash = res.data.infoHash
						console.log('没取消解析.....')
						this.$dialog.close()
					}
					
				}else{
					console.log('取消解析....')
				}
			})
		},
		onSwipeLeft () {
			// alert('页面右滑')
		    // console.log('页面左滑')
		  // this.$router.go(-1)
		},
		onSwipeRight(){
			if(localStorage.slideReturn == 1){
				this.$router.go(-1)
			}
		    // alert('页面右滑')
			// 跳转其他页面的时候记录高度
			// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			// alert('漫画高度' + this.curScroll)
		    // this.$router.go(-1)
		},
		async collectionClick() {
		   if(localStorage.getItem('token')){
		     // 判断显示状态,是收藏还是取消收藏
		     if(!this.collectionActive){
		       const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'3'})
		       // console.log(res)
		       if(res.data.data == '收藏成功'){
		           this.collectionActive = true
		       }else{
		           // this.collectionActive = false
		           this.$msg.fail(res.data.message)
		       }
		     } else {
		       const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.$route.params.id,collectionType:'3'})
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
						  collectionType:'3'
		        })
		        // console.log(res.data)
		    this.collectionActive = res.data.data == '1' ? true : false;
				  // console.log(this.collectionActive)
		    }
		},
		// 图片加载结束
		imgLoad(e){
			if(this.$refs['workImage'][e]){
				this.$refs['workImage'][e].$refs.image.style.objectPosition = 'top';
			}
		},
		// 跳转到查询页面
		toSearch(search){
			// console.log(encodeURI(search))
			this.$router.push('/search?search=' + encodeURI(search));
		},
		pathPush(item){
			// this.$router.push(`/personWork/${item.id}`)
			if(item.person_id){
				this.$router.push(`/person/${item.person_id}/SEX`)
			}

		},
		// 复制成功
		onCopy(){
			this.$msg.success('复制成功')
		},
		// 复制失败
		onError(){
			this.$msg.fail('复制失败')
		},
		// 图片预览
		imagePreview(item){
			// console.log(item)
			ImagePreview({
				images: this.imagePreviews,
				startPosition:item.works_content_number -1 
			})
		},
		bigImagePreview(){
			ImagePreview({
				images:this.converPreviews
			})
		},
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		async initPersonWorkData(){
			this.$msg.loading({
			  message: '加载中...',
			  forbidClick: true,
			  loadingType: 'spinner'
			});
			// console.log('???????????????被执行')
			// alert(1110)
			const res = await this.$http.post("/person/queryPersonWork", {
			  pageNum: 1,
			  pageSize: 10,
			  workId: this.$route.params.id
			})
			
			res.data.data.list[0].conver = '/video/person/' + encodeURI(res.data.data.list[0].person_nationality) + '/' + encodeURI(res.data.data.list[0].person_name) + '/' + res.data.data.list[0].works_number + '/bigCover.jpg'
			this.work = res.data.data.list[0]
			// 判断是否有类型,有进行分割
			if(this.work.works_category){
				this.work.works_category_arr = this.work.works_category.split('#PLACEHOLDER#');
				// for(let i =0;i<this.work.works_category.length;i++){
					
				// }
				// #PLACEHOLDER#
			}
			this.converPreviews.push(this.baseURL +  this.work.conver+ '?token=' + this.token)
			this.$msg.clear()
			// 磁力数据
			this.initMagnet();
		},
		async initPersonWorkParticipate(){
			if(!this.$route.params.id){
				return;
			}
			const res = await this.$http.post("/person/queryPersonWorkParticipate", {
			  workId: this.$route.params.id
			})

			this.participates = res.data.data
			for(let i =0;i<this.participates.length;i++){
				let  personNationality = this.participates[i].person_nationality
				if(personNationality){
					this.participates[i].personNationality = '/video/person/' + personNationality + '/' +this.participates[i].person_name +'/head.jpg'
				}
			}
			
		},
		initPersonWorkImage(){
			this.$http.post("/person/queryPersonWorkDetail", {
			  workId: this.$route.params.id
			}).then(res=>{
				this.workImages = res.data.data
				for(let i =0;i<this.workImages.length;i++){
					this.imagePreviews.push(this.baseURL + this.workImages[i].content + '?token=' + this.token)
				}
			})
			
		},
		initMagnet(){
			this.$http.get("/magnet/queryMagnet?name=" + this.work.works_number).then(res=>{
				this.magnetList = res.data
			})

		}
	},
	created(){
		// 作品数据
		this.initPersonWorkData()
		// 演员数据
		this.initPersonWorkParticipate()
		// 预览图数据
		this.initPersonWorkImage();
		
		// 收藏状态
		this.collectionInit();
	}
}
</script>

<style scoped>
	.van-image__error, .van-image__img, .van-image__loading{
	display: block;
	width: 100%;
	height: 100%;
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
.text{
	margin-top: 5px;
	color: #646566;
	font-size: 14px;
	text-align: center;
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
	border-color:black;
	background-color:white;
}
/* .van-image,.van-image__error, .van-image__img, .van-image__loading{
	display: block;
	width: 100%;
	object-fit: cover;
	object-position: top;
	height: 100%;
	width:100%;
	 height:30.778vw; 
} */

</style>
