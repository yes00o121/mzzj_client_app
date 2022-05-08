<template>
	<div>
		<div v-show="analysisData.length == 0 ">
			<van-sticky >
				<van-cell  style="z-index:999;"  icon="arrow-left" title="资源搜索"  @click="returnPage"/>
			</van-sticky>
			<van-search
			  v-model="value"
			  show-action
			  placeholder="请输入搜索关键词"
			  @click="onSearch"
			>
			<div slot="action" @click="onSearch">搜索</div>
			</van-search>
			<div v-if="magnetList.length > 0">
				<van-cell-group style="text-align: initial;">
					<!-- <van-cell title="磁力" value="" /> -->
				</van-cell-group>
				<van-cell :title="item.torrentName" v-for="(item,index) in magnetList" :key="index" v-clipboard:copy="item.magnet" v-clipboard:success="onCopy" v-clipboard:error="onError">
					<div style="margin-left: 2rem;float: left;">
						{{item.size}}
					</div>
				  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
				   <van-button type="default" size="mini" @click.stop="analysis(item)">解析</van-button>
				</van-cell>
			</div>
			<div v-if="magnetList.length == 0 ">
				搜索内容未找到
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
	</div>
</template>

<script>
export default{
	data(){
		return {
			value:'',
			magnetList:[],
			showVideo:false,
			infoHash:'',// 链接hash
			analysisData:[],// 解析数据
			analysisStatus:false // 解析状态
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
		    height: '200px',
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
						  src:'http://192.168.1.5:9000/api/torrent/serve/' +this.infoHash + this.videoItem.path,
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
			this.$http.get('http://192.168.1.5:9000/api/torrent/info?torrentId=' + item.magnet).then(res=>{
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
		onCopy(){
			this.$msg.success('复制成功')
		},
		// 复制失败
		onError(){
			this.$msg.fail('复制失败')
		},
		returnPage(){
			this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
			this.$router.go(-1)
		},
		onSearch(){
			if(this.value){
				this.search = false
				this.$http.get("/magnet/queryMagnet?name=" + this.value).then(res=>{
					this.magnetList = res.data
				})
			}
		}
	}
}
</script>

<style scoped>
</style>
