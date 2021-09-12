<template>
  <div class="my-video" :style="VideoItemHeightStyle" @click="playVideo()">
    <!-- <video class="video" :src="baseURL + VideoItem.videoPath"
      :poster="VideoItem.videoCover"
      webkit-playsinline
      playsinline
      x5-video-player-type="h5"
      preload="none"
      @click="playHandler($event)"
      @loadeddata="watchHandler"
      ref="video"></video> -->
	  <video ref = "videoPlayer" v-if="VideoItem.videoType == 'm3u8'"  class="video"
	  style="width:100%;height:100%"
	  :poster="baseURL +  VideoItem.previewImg"
	  webkit-playsinline="true" x5-video-player-type="h5-page"
	  x5-playsinline  x-webkit-airplay="allow"
	  x5-video-player-fullscreen="true" playsinline="true" preload="auto"
	  :controls="false" :videoType="VideoItem.videoType"   :playUrl="VideoItem.url"
	  object-fit="fill"
	  ></video>
    <div class="side-bar">	
      <div class="avatar">
       <!-- <img :src="`${baseURL}${VideoItem.userAvatar}`" alt="" width="40" height="40"
          @click="chooseUser"> -->
		  <img :src="`${baseURL}/common/image?imgId=6103eed9f1a2480958525955`" alt="" width="40" height="40"
		    >
		  
        <!-- <div class="follow">+</div> -->
      </div>
      <div class="like iconfont icon-heart-fill" :class="{ 'red-heart': like }" @click="toggleLike(VideoItem.videoId)">
        <span class="likenum">{{likeNum}}</span>
      </div>
      <div class="comment iconfont icon-message" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)">
        <span class="commentnum">{{VideoItem.commentNum}}</span>
      </div>
      <div class="share iconfont icon-share">
        <span class="sharenum">{{VideoItem.shareNum}}</span>
      </div>
    </div>
    <div class="text-wrap">
      <div class="name">@{{VideoItem.userNickname}}</div>
      <div class="desc">{{VideoItem.videoDesc}}</div>
    </div>
    <div class="input-bar" v-show="!isHome" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)">
      <input class="input" placeholder="  有爱评论，说点儿好听的~" type="text">
      <span class="iconfont icon-at" ></span>
      <span class="iconfont icon-check"></span>
    </div>
	<img v-show="!playStatus" class="icon_play"
	     src="@/assets/play.png"/>
  </div>
</template>

<script>
// import { baseURL } from '@/common/js/config'
import { mapGetters } from 'vuex'
export default {		
  props: {
    VideoItem: {
      type: Object,
      required: true
    },
	index:{
		type:Number
	}
  },
  created () {
    // if (this.isLogged) {
      // this.$axios.get(`/api/user/${this.loginInfo.userId}/isLiked/${this.VideoItem.videoId}`).then(res => {
      //   this.like = res.data.data
      // })
	  this.$nextTick(()=>{
		  // 判断位置,如果高度和index相同,跳转并且播放该视频
		  let curIndex = this.$parent.$parent.currentHeight  /  document.body.clientHeight
		  // console.log(this.VideoItem)
		  // console.log(document.body.clientHeight)
		  if(this.VideoItem.videoType == 'm3u8'){
		  	  // console.log(this)
		  	  this.video = this.$video(
		  	            this.$refs.videoPlayer,
		  	            // this.options,
		  	  		  {
		  	  			  // autoplay: 'muted',//自动播放
		  	  
		  	  			  loop:true,
		  	  			  controls: false,//用户可以与之交互的控件
		  	  		  },
		  	            function onPlayerReady() {
		  	  				this.on("progress",function(){
		  	  					// 5
		  	  					// console.log("正在请求数据 ");
		  	  					this.el_.getElementsByTagName('span')[0].innerText = ''
		  	  				})
		  	  		  }
		  	          );
		  	  // alert(111)
		  	  let nextAddress = this.VideoItem.nextAddress
		  	  nextAddress = nextAddress.split('_-')[1]
		  	  this.video.src({
		  	  		  src:this.baseURL + '/webInfoVideo/' + nextAddress + '/' + nextAddress,
		  	  		  type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
		  	  		})
			 if(curIndex == this.index){
				// console.log('当前选中....' + curIndex + '--------' + this.$parent.$parent.currentHeight)
				// top.a = this
				this.$parent.$parent.$refs.scroll.scrollTo(0,this.$parent.$parent.currentHeight)
				 this.video.play()
				 // 延迟0.5秒,等待滚动事件加载完成
				 // setTimeout(()=>{
					//  this.$parent.$parent.currentHeight = 0
				 // },1000)

			 }
		    	// clearInterval(videoProcessInterval)
		    	// this.stopProcess()
		    	// 每次刷新index会被重置,当current不是0说明以加载一些数据,手动+1后定位过去
		    	// this.current = index;
		    	// 向上滑动判断是否视频已经加载到最后,加载到最后加载新视频数据，然后滑动组件向下一个
		    	// if(this.videoList.length - 1 == this.current){
		    	// 	// 提示加载数据
		    	// 	this.loadData(function(){
		    	// 		index
		    	// 	})
		    	// 	return;
		    	// }
		    	// this.current = index;
		    // 	let obj = this.videoList[this.current].vObj
		    // 	if(obj){
		    // 		// console.log('存在操作.....')
		    // 		this.playOrPause = true;
		    // 		this.showShareBox = false;
		    // 		obj.play()
		    // 	}else {
		    // 		this.playOrPause = true;
		    // 		this.showShareBox = false;
		    // 		// this.isVideoShow = false;
		    // 		// console.log('不存在，进行添加.....')
		    // 		let curVideo = document.querySelectorAll('video')[this.current];
		    // 		let vdoSrc= curVideo.getAttribute('playUrl')
		    // 		// console.log(vdoSrc)
		    // 		// console.log(this.$refs.videoPlayer[this.current])
		    // 		let myVideo = this.$video(
		    // 		          this.$refs.videoPlayer[this.current],
		    // 		          // this.options,
		    // 				  {
		    // 					  // autoplay: 'muted',//自动播放
		    
		    // 					  loop:true,
		    // 					  controls: false,//用户可以与之交互的控件
		    // 				  },
		    // 		          function onPlayerReady() {
		    // 						this.on("progress",function(){
		    // 							// 5
		    // 							// console.log("正在请求数据 ");
		    // 							this.el_.getElementsByTagName('span')[0].innerText = ''
		    // 						})
		    // 				  }
		    // 		        );
		    // 		myVideo.src({
		    // 		  src:vdoSrc,
		    // 		  type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
		    // 		})
		    // 		myVideo.play()
		    // 		this.videoList[this.current].vObj = myVideo
		    // 		this.loadCollection()
		    // 		this.loadCommentAndCollectionNum()
		    // 	}
		    // 	// 重新计时
		    // 	this.startProcess()
		    
		    // } else {
		    // 	//改变的时候 暂停当前播放的视频
		    // 	// clearInterval(videoProcessInterval)
		    // 	this.stopProcess()
		    // 	setTimeout(() => {
		    // 		this.pauseVideo() // 暂停之前视频
		    // 	}, 100)
		    // 	video.pause();
		    // 	this.playOrPause = false;
		    // 	this.showShareBox = false;
		    // 	this.current = index;
		    // 	this.isVideoShow = false;
		    // 	// this.playvideo();// 播放当前视频
		    
		    // 	setTimeout(() => {
		    // 		this.pauseVideo()
		    // 	}, 100)
		    // }
		  }
	  })
	 
  },
  data () {
    return {
      // baseURL,
      like: false,
      likeNum: this.VideoItem.likeNum,
	  video: null,
	  playStatus:true // 播放状态,默认播放
    }
  },
  computed: {
    isHome () {
      return this.$route.name === 'home'
    },
    VideoItemHeightStyle () {
      let clientWidth = document.body.clientWidth
      let clientHeight = document.body.clientHeight
      return {
        height: clientHeight + 'px',
        width: clientWidth + 'px'
      }
    },
    ...mapGetters([
      'isLogged',
      'loginInfo'
    ])
  },
  methods: {
    playHandler (e) {
      this.$emit('playVideo', e)
    },
    watchHandler () {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/watch/${this.VideoItem.Video.videoId}`).then(res => {
      })
    },
    showCommentList (videoId, commentNum) {
      this.$emit('showCommentList', videoId, commentNum)
    },
	playVideo(){
		console.log(this.video)
		top.a = this.video
		if(this.playStatus){
			this.video.pause()
		}else{
			this.video.play()
		}
		this.playStatus = !this.playStatus
	},
    toggleLike (videoId) {
      if (this.isLogged) {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerLike/${this.VideoItem.Video.videoId}`).then(res => {
          if (res.data.data.includes('取消')) {
            this.like = false
            this.likeNum--
          } else {
            this.like = true
            this.likeNum++
          }
          this.$socket.emit('sendTriggerLike', {
            fromUserId: this.loginInfo.userId,
            toUserId: this.VideoItem.Video.userId
          })
        })
      }
    },
    chooseUser () {
      this.$router.push(`/profile/${this.VideoItem.Video.userId}`)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.my-video
  position relative
  .icon_play
    position absolute
    top 44%
    right 0
    left 0
    bottom auto
    margin auto
    z-index 999
    height 60px
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  .input-bar
    border-top .5px solid $color-divide
    width 100%
    display flex
    height 44px
    position absolute
    bottom 0
    background rgba(26, 27, 32, 0)
    .input
      background rgba(26, 27, 32, 0)
      flex 1
      font-size $font-size-medium
      color $color-text
      padding-left 10px
      &:focus
        outline none
        border none
    .iconfont
      display flex
      justify-content center
      align-items center
      width 44px
  .video
    display block
    width 100%
    height 100%
  .text-wrap
    position absolute
    left 10px
    bottom 54px
    width 70%
    .name
      color $color-white
      margin-bottom 10px
    .desc
      font-size $font-size-medium
      color $color-text
  .side-bar
    position absolute
    right 10px
    bottom 74px
    display flex
    flex-direction column
    height 250px
    justify-content space-between
    .avatar
      position relative
      border-radius 50%
      background none
      border 1px solid $color-text
      img
        border-radius 50%
      .follow
        text-align center
        position absolute
        bottom 0
        left 50%
        transform translateX(-50%) translateY(50%)
        width 16px
        height 16px
        font-size 16px
        border-radius 50%
        background rgb(252, 52, 93)
    .like
      position relative
      .likenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .red-heart
      color rgb(248, 53, 95)
    .comment
      position relative
      .commentnum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .share
      position relative
      .sharenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
  .side-bar > div
    width 40px
    height 40px
    font-size 40px
    color $color-text
    transition color .3s
</style>
