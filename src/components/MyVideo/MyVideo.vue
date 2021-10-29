<template>
	<div >
 <v-touch v-on:panup="panup" v-on:panstart="panstart" v-on:panend="panend" v-on:panleft="panLeft" v-on:panright="panRight"  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div class="my-video" :id="'div_' + VideoItem.id" :style="VideoItemHeightStyle" @click.stop="playVideo()" >
    <!-- <video class="video" :src="baseURL + VideoItem.videoPath"
      :poster="VideoItem.videoCover"
      webkit-playsinline
      playsinline
      x5-video-player-type="h5"
      preload="none"
      @click="playHandler($event)"
      @loadeddata="watchHandler"
      ref="video"></video> -->
	 <!-- <video ref = "videoPlayer" :id="VideoItem.id" v-if="VideoItem.videoType == 'm3u8'"  class="video"
	  style="width:100%;height:100%;visibility: hidden;" -->
<!-- 	  <video ref = "videoPlayer" :id="VideoItem.id" v-if="VideoItem.videoType == 'm3u8'"  class="video"
	  style="width:100%;height:100%;"
	  :poster="baseURL +  VideoItem.previewImg + '&token=' + token"
	  webkit-playsinline="true" x5-video-player-type="h5-page"
	  x5-playsinline  x-webkit-airplay="allow"
	  x5-video-player-fullscreen="true" playsinline="true" preload="auto"
	  :controls="false" :videoType="VideoItem.videoType"   :playUrl="VideoItem.url"
	  object-fit="fill"
	  ></video> -->
    <div class="side-bar">	
      <div class="avatar" @click.stop="">
       <!-- <img :src="`${baseURL}${VideoItem.userAvatar}`" alt="" width="40" height="40"
          @click="chooseUser"> -->
		  <img :src="`${baseURL}/common/image?imgId=6103eed9f1a2480958525955&token=${token}`" alt="" width="40" height="40"
		    >
		  
        <!-- <div class="follow">+</div> -->
      </div>
	  <!-- 加载状态-->
	  <van-loading class="iconfont" v-show="collStatus"/>
	  <!-- 收藏按钮 -->
      <div class="like iconfont icon-heart-fill" v-show="!collStatus" :class="{ 'red-heart': like }" @click.stop="collectionClick()">
        <span class="likenum">{{collNum}}</span>
      </div>
	  <!-- 评论图标-->
      <!-- <div class="comment iconfont icon-message" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)"> -->
	  <div class="comment iconfont icon-message" @click.stop="changeComment()">
        <span class="commentnum">{{commentNum}}</span>
      </div>
      <div class="share iconfont icon-share" @click.stop="$msg.fail('分析功能关闭')">
        <!-- <span class="sharenum">{{commentNum}}</span> -->
		<!-- <span class="sharenum">0</span> -->
      </div>
    </div>
	<div class="label-wrap">
		<div style="text-align: left;margin-right: 20px;box-sizing: border-box;
    margin-right: 8px;
	margin-top: 10px;
    padding: 3px 6px;
	float: left;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #eaeaef;
    height: 24px;
    line-height: 17px;
    border-radius: 2px;
    display: inline-block;" :key="item.code" v-for="item in VideoItem.labelList" @click.stop="labelSave(item)">
	<span :style="item.status == '1' ? ('color: #F8355F;') : ('color: #5094d5;')">
			{{item.name}} 
	</span>
		</div>
	</div>
    <div class="text-wrap">
      <!-- <div class="name">@{{VideoItem.userNickname}}</div> -->
      <div class="desc van-multi-ellipsis--l2" style="text-align: initial;">{{VideoItem.title}}</div>
    </div>
	 <div  style="text-align: initial;text-align: initial;
    position: absolute;
    bottom: 66px;
    color: white;
    right: 11px;">{{VideoItem.videoLength | getDateBysecond}}</div>
	<div style="position:absolute;bottom:48px;width:100%"> <!-- 当前播放位置 -->
	  <van-slider v-model="videoProcess" :min="0" :max="100" :button-size="1" @drag-start="dragStart" @drag-end="dragEnd" @input="dragInput" @change="dragChange"/></div>
    <div class="input-bar" v-show="bottomComment" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)">
		
     <input class="input" :placeholder="  '有爱评论，说点儿好听的~'" type="text">
      <!-- <span class="iconfont icon-at" ></span> -->
      <span class="iconfont icon-check"></span>
    </div>
	<img v-show="!playStatus" class="icon_play"
	     src="@/assets/play.png"/>
  </div>
  </v-touch>
  </div>
</template>

<script>
// import { baseURL } from '@/common/js/config'
import { mapGetters } from 'vuex'
import comment from '@/components/comment'
export default {		
  props: {
    VideoItem: {
      type: Object,
      required: true
	  
    },
	index:{
		type:Number
	},
	bottomComment:{
		type:Boolean
	},
	videoHeight:{
		type:Number
	}
  },
  beforeDestroy: function () {
	  if(this.video){
		        this.video.dispose();
	  }

  
   },
  data () {
    return {
  		commentPop:false,
  		// replayUserData: '',
  		// to_comment_id: '',
  		// commentPop: false,//是否展示评论弹框
  		// // 评论相关
  		// comment_text: '',//评论输入内容
  		// canSend: false,//是否可以发送
  		// videoComment: [],
  		// commentPlaceholder: '留下你精彩的评论吧',//评论Placeholder
  		commentNum:0, // 评论数
  		collNum: 0,// 收藏数
  	  collStatus:false, // 是否收藏状态,收藏状态显示加载图标
  		token: 'Bearer ' + localStorage.token, // 用户token
      // baseURL,
      like: this.VideoItem.collection == '是',
      likeNum: this.VideoItem.likeNum,
  	  video: null,
  	  playStatus:true ,// 播放状态,默认播放
  	  videoProcess:0 ,// 进度条位置
  	  maxVideoProcess: 0, // 当前视频长度
  	  videoProcessInterval:null,
	  videoMessage: null, // 视频滑动进度消息对象
	  upOrDown:false // 是否上下滑动,用于控制左右滑动失效
    }
  },
  watch:{
  	commentPop(cur){
		// if(cur){
		// 	this.$parent.$parent.bottomShow = false
		// }else {
		// 	setTimeout(()=>{
		// 	this.$parent.$parent.bottomShow = true
		// 	},100)
		// }
  	}  
  },
  filters:{
		// 根据秒获取时间
		getDateBysecond(second){
			if(second < 60){
				return '00:' + (second <= 9 ? '0' + second: second);
			}
			let minute = parseInt(second/60)
			let s = second - (minute * 60)
			if(minute < 60){
				return (minute <= 9 ? '0' + minute : minute) + ':' + (s <= 9 ? '0' + s : s);
			}
			return '';
		}
	},
  components:{comment},

  computed: {
    isHome () {
      return this.$route.name === 'home'
    },
    VideoItemHeightStyle () {
      let clientWidth = top.document.body.clientWidth
      let clientHeight = top.document.body.clientHeight
	  if(this.videoHeight && this.videoHeight > 0){
		  clientHeight = this.videoHeight
	  }
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
	  // 用户保存删除标签
	  async labelSave(label){
		  if(label.status == 1){
			  // 已收藏,取消收藏
			  const res = await this.$http.post('/label/deleteLabelUserByUserIdAndLabelCode/',{labelCode:label.code})
			  // console.log(res)
			  if(res.data.message == '操作成功'){
			  				  // 修改标签状态和颜色
				  label.status = 0
			  }
		  } else {
			  // 未收藏,收藏
			  const res = await this.$http.post('/label/insertLabelUser/',{labelCode:label.code})
			  // console.log(res.data.message)
			  if(res.data.message == '操作成功'){
				  // 修改标签状态和颜色
				  label.status = 1
			  }
		  }
	  },
	  onSwipeLeft () {
	  	// alert('页面右滑')
	      // console.log('页面左滑')
	    // this.$router.go(-1)
	  },
	  onSwipeRight(){
	      // console.log('页面右滑')
	  	// 跳转其他页面的时候记录高度
	  	// this.curScroll = document.documentElement.scrollTop || document.body.scrollTop;document.body.scrollTop;
	  	// alert('漫画高度' + this.curScroll)
	      // this.$router.go(-1)
	  },
	  // 向下滑动
	  pandown(){
		  this.upOrDown = true
		  // this.$msg.clear()
	  },
	  // 向上滑动
	  panup(){
		this.upOrDown = true
		// this.$msg.clear()
	  },
	  panLeft(point){
		// console.log('左滑' + document.body.scrollHeight)
		// 如果是上下滑动,不触发
		if(this.upOrDown){
		  return;
		}
		if(!this.videoMessage){
		  // 获取当前视频进度,设置为初始值
		  let video = this.getVideo()
		  this.videoMessage = this.$msg({
			  message:0,
			  duration:0,
			  curNum:parseInt(video.currentTime)
		  })
		}
		  this.videoMessage.curNum -=1
		  this.progressSpeed()
	  },
	  // 显示进度条
	  progressSpeed(){
			// 如果滑动超过视频长度,把滑动长度改成和视频长度一致
			if(this.videoMessage.curNum > this.VideoItem.videoLength){
				this.videoMessage.curNum = this.VideoItem.videoLength
			}
			let curTime = this.getDateBysecond(this.videoMessage.curNum) // 当前滑动进度
			let videoLength = this.getDateBysecond(this.VideoItem.videoLength) // 视频总长度
			this.videoMessage.message = curTime + '/' + videoLength
	  },
	  // 开始拖动
	  panstart(){
		  // 判断高度,如果是上滚动,不执行
		  // console.log('开始滑动....' + document.body.scrollHeight)
		  this.upOrDown = false
	  },
	  // 拖动结束
	  panend(){
		  
		  if(this.upOrDown){
			  this.upOrDown = false
			   this.$msg.clear()
			  return;
		  }
		  // 结束时,获取视频时间位置,定位到那个地方
		  let video = this.getVideo()
		  video.currentTime = this.videoMessage.curNum
		  this.$msg.clear()
		  this.videoMessage = null;
	  },
	  panRight(point){
		  // 如果是上下滑动,不触发
		  if(this.upOrDown){
			  return;
		  }
		  if(!this.videoMessage){
			  // 获取当前视频进度,设置为初始值
			  let video = this.getVideo()
			  this.videoMessage = this.$msg({
			  			  message:0,
			  			  duration:0,
			  			  curNum:parseInt(video.currentTime)
			  })
		  }
		  this.videoMessage.curNum +=1
		  this.progressSpeed()
		  console.log('右滑' + document.body.scrollHeight)  
		  // let video = this.getVideo()
		  // // 获取当前视频进度,在进度上减少进度,显示出来
		  // video.currentTime +=1
	  },
	  // 根据秒获取时间
	  getDateBysecond(second){
		  if(second <= 0){
			   return '00:00'
		  }
	  	if(second < 60){
	  		return '00:' + (second <= 9 ? '0' + second: second);
	  	}
	  	let minute = parseInt(second/60)
	  	let s = second - (minute * 60)
	  	if(minute < 60){
	  		return (minute <= 9 ? '0' + minute : minute) + ':' + (s <= 9 ? '0' + s : s);
	  	}
	  	return '';
	  },
	  // 创建html标签
	  getVideoHtml(){
		  // visibility: hidden;
		  // console.log('销毁重新创建......')
		  let html = `<video id="${this.VideoItem.id}"   class="video"
	  style="width:100%;height:100%;"
	  poster="${this.baseURL}${this.VideoItem.previewImg}&token=${this.token}"
	  webkit-playsinline="true" x5-video-player-type="h5-page"
	  x5-playsinline  x-webkit-airplay="allow"
	  x5-video-player-fullscreen="true" playsinline="true" preload="auto"
	  controls="false" videoType="${this.VideoItem.videoType}"   playUrl="${this.VideoItem.url}"
	  object-fit="fill"
	  ></video>`;
		  $('#div_' + this.VideoItem.id).prepend(html)
		  return $('#div_' + this.VideoItem.id + ' video')[0]
		  // return '#'this.VideoItem.id
		  // console.log($('#div_' + this.VideoItem.id))
	  },
	  createVideo(){
		this.$nextTick(()=>{
			// console.log('创建视频')
			// console.log(this.$refs.videoPlayer)
					// alert('创建视频gaodu' + document.body.clientHeight)
				  // 判断位置,如果高度和index相同,跳转并且播放该视频
				  let curIndex = this.$parent.$parent.currentHeight  /  document.body.clientHeight
				  if(this.VideoItem.videoType == 'm3u8'){
				  	  this.video = this.$video(
				  	            // this.$refs.videoPlayer ,
								this.getVideoHtml(),
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
				  	  let nextAddress = this.VideoItem.nextAddress
				  	  nextAddress = nextAddress.split('_-')[1]
				  	  this.video.src({
				  	  		  src:this.baseURL + '/webInfoVideo/' + nextAddress + '/' + nextAddress,
				  	  		  type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
				  	  		})
					 if(curIndex == this.index){
						// this.$parent.$parent.$refs.scroll.scrollTo(0,this.$parent.$parent.currentHeight)
						 this.video.play()
						 // 加载收藏和评论数量
						 this.loadCommentAndCollectionNum();
						this.stopProcess()
						this.startProcess();
						this.recordFlowNum()
						
						// 记录视频流量
						
						
						// console.log($('.my-video'))
						// $('.my-video').each((index,e)=>{alert($(e).height())})
						 // 延迟0.5秒,等待滚动事件加载完成
						 // setTimeout(()=>{
							//  this.$parent.$parent.currentHeight = 0
						 // },1000)
		
					 }
				    
				  }
		})  
	  },
	  recordFlowNum(){
		// this.$http.get('')  
		this.$http.get('/webInfoVideo/recordFlowNum?id=' + this.VideoItem.id)
	  },
	 //  //弹出评论窗口
	  changeComment() {
		  // 暂停当前视频
		  // this.video.pause()
		  // this.playStatus = false
		  this.$parent.$parent.$refs.comment.commentPop = true
		  this.$parent.$parent.$refs.comment.videoComment = [];
		  this.$parent.$parent.$refs.comment.getComment(this.getVideo())
	  },
	  setCommentNum(num){
	  		  this.commentNum = num
	  },
	  //记录播放进度
	  changeProcess() {
		  // console.log(this.$refs['videoPlayer'])
		// console.log('记录播放。。。。')
		// top.a = this.$refs
		  let video = this.getVideo()
		  if(video){
			  let currentTime = video.currentTime.toFixed(1);
			  // console.log(currentTime)
			  let duration = video.duration.toFixed(1);
			  this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100)
		  }
		  /*else{
			  this.stopProcess()
		  }*/

	  },
	  // 开始计时
	startProcess(){
		this.maxVideoProcess = this.getVideo().currentTime // 记录当前视频长度
		this.videoProcessInterval = setInterval(() => {
			// video.style.visibility = 'visible'
			this.changeProcess(this.getVideo())
		}, 100)
	},
	// 停止计时
	stopProcess(){
		// 视频时间重置
		let video = this.getVideo();
		if(video){
			video.currentTime = 0;
			this.videoProcess = 0
		}
		clearInterval(this.videoProcessInterval)
	},
	getVideo(){
		return $('#'+this.VideoItem.id+'_html5_api')[0]
	},
	// 获取评论收藏数量
	async loadCommentAndCollectionNum(){
		// const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=4853011')
		const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=' + this.VideoItem.id)
		// console.log(res)
		// console.log(res)
		if(res.data){
			this.commentNum = res.data.commentNum
			this.collNum = res.data.collNum
		}

	},
	  // 开始拖动,暂停播放
		dragStart(e){
			// alert('22222')
			clearInterval(this.videoProcessInterval)
			// if(!this.iconPlayShow){
			// 	this.playvideo()
			// }
			this.video.pause()
			this.playStatus = false

			// console.log('开始拖动')
		},
		// 结束拖动
		dragEnd(e){
			// console.log('结束拖动')
		},
		// 进度条变化触发,用于获取位置，显示当前时间
		dragInput(value){
			// console.log(value)
			clearInterval(this.videoProcessInterval)
			// if(!this.iconPlayShow){
			// 	this.playvideo()
			// }
			// 
		},
		// 进度条变化,且结束时候触发,用于加载当前位置视频
		dragChange(value){
			// alert(value)

			// let duration = document.querySelectorAll('video')[this.current].duration.toFixed(0);
			let video = this.getVideo()
			console.log('拖动结束位置' + value)
			this.videoProcess = value
			video.currentTime = parseInt((video.duration * (value/100)).toFixed(2))
			// this.playvideo()
			// video.play()
			// this.playvideo()
			// console.log(this.video)
			// top.a = this.video

			this.video.play()
			this.playStatus = true
			this.startProcess()
			// this.playvideo()
		},
	  // 收藏数据
	  async collectionClick() {
	     if(localStorage.getItem('token')){
			 this.collStatus = true
	       // 判断显示状态,是收藏还是取消收藏
	       if(this.like){
	  		  const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.VideoItem.id})
	  		  if(res.data.data == '取消成功'){
	  			// this.videoList[this.current].fabulous = false
				this.like = !this.like
	  		  } else {
	  			 this.$msg.fail(res.data.message)
	  		  }
	       } else {
	  		 const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.VideoItem.id})
	  		 if(res.data.data == '收藏成功'){
	  		     // this.videoList[this.current].fabulous = true
				 this.like = !this.like
	  		 }else{
	  		     this.$msg.fail(res.data.message)
	  		 }
	       }
		   this.collStatus = false
	  	// 收藏后，重新加载收藏数据
			this.loadCommentAndCollectionNum()
	     }
	  },
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
		// 如果打开了评论窗口,点击失效
		if(this.commentPop){
			return;
		}
		// console.log(this.video)
		// top.a = this.video
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

<style  lang='stylus' >
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
    /* z-index 999 */
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
  .label-wrap
    /* display flex */
    /* color #e8e8e9 */
    position absolute
    left 10px
    bottom 100px
    width 70%
  .text-wrap
    position absolute
    left 10px
    bottom 60px
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
    bottom 120px
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
