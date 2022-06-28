<template>
	<div >
 <v-touch v-on:panup="panup" v-on:panstart="panstart" v-on:panend="panend" v-on:panleft="panLeft" v-on:panright="panRight"  v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div" style="touch-action: pan-y!important;" :swipe-options="{direction: 'horizontal'}">
  <div style="position:relative;background-color: black;">
	  <!-- 隐藏模式下的工具栏图标 -->
	  <van-icon name="ellipsis" size="24" color="white" style="position: absolute;
	      top: 0rem;z-index:9999;padding:1rem;
	      right: 0rem;" @click.stop="openTools(VideoItem)" v-show="!showPageTool"/>
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
      <div class="avatar" @click.stop="" style="border:none" v-show="showPageTool">
       <!-- <img :src="`${baseURL}${VideoItem.userAvatar}`" alt="" width="40" height="40"
          @click="chooseUser"> -->
		  <!-- <img :src="`${baseURL}/common/image?imgId=61b88b894316b402bcbf833f&token=${token}`" alt="" width="40" height="40"
		    > -->
		  <img src="@/assets/user_1.png" width="40" height="40"  @click="toUserVideo(VideoItem)" v-if="VideoItem.personId" >
		  <img src="@/assets/user_1.png" width="40" height="40" v-if="!VideoItem.personId" >
		  <!-- <img src="@/assets/user_2.png" width="40" height="40" v-if="user_photo == 1" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_3.png" width="40" height="40" v-if="user_photo == 2" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_4.png" width="40" height="40" v-if="user_photo == 3" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_5.png" width="40" height="40" v-if="user_photo == 4" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_6.png" width="40" height="40" v-if="user_photo == 5" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_7.png" width="40" height="40" v-if="user_photo == 6" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_8.png" width="40" height="40" v-if="user_photo == 7" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_9.png" width="40" height="40" v-if="user_photo == 8" @click="toUserVideo(VideoItem)">
		  <img src="@/assets/user_0.png" width="40" height="40" v-if="user_photo == 9" @click="toUserVideo(VideoItem)"> -->
        <div class="follow" v-if="collectionUser != '是' && VideoItem.personId" @click="collectionPersonClick(VideoItem)">+</div>
		<div class="follow" style="background:#7e5c63" v-if="!VideoItem.personId" >+</div>
      </div>
	  <!-- 加载状态-->
	  <van-loading class="iconfont" v-show="collStatus"/>
	  <!-- 收藏按钮 -->
      <div class="like iconfont icon-heart-fill" v-show="!collStatus && showPageTool" :class="{ 'red-heart': like }" @click.stop="collectionClick()" >
        <span class="likenum">{{collNum}}</span>
      </div>
	  <!-- 评论图标-->
      <!-- <div class="comment iconfont icon-message" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)"> -->
	  <div class="comment1 iconfont icon-message" @click.stop="changeComment()" v-show="showPageTool">
        <span class="commentnum">{{commentNum}}</span>
      </div>
<!--      <div class="share iconfont icon-share" @click.stop="$msg.fail('分享功能关闭')">
		<span class="sharenum">0</span>
      </div> -->
	  <!-- 工具栏 -->
	  <div class="share iconfont icon-ellipsis" @click.stop="openTools(VideoItem)" v-show="showPageTool">

	  </div>

    </div>
	<!-- <div class="label-wrap"> -->
	<!-- 	<div style="text-align: left;margin-right: 20px;box-sizing: border-box;
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
		</div> -->
	<!-- </div> -->

    <div class="text-wrap" v-show="showPageTool">
      <div class="name" style="text-align: left;"><span v-if="VideoItem.personName">@</span>{{VideoItem.personName}}</div>

      <div class="desc van-multi-ellipsis--l2" style="text-align: initial;">{{VideoItem.title}}</div>
    </div>
	 <div  style="text-align: initial;text-align: initial;
    position: absolute;
    bottom: 66px;
    color: white;
	z-index:9999;
    right: 11px;" v-show="showPageTool">{{VideoItem.videoLength | getDateBysecond}}</div>
	<div style="position:absolute;bottom:48px;width:100%" v-show="showPageTool"> <!-- 当前播放位置 -->
	  <van-slider style="z-index:200" v-model="videoProcess" :min="0" :max="100" :button-size="1" @drag-start="dragStart" @drag-end="dragEnd" @input="dragInput" @change="dragChange"/>
	  </div>
    <!-- <div class="input-bar" v-show="bottomComment & showPageTool" @click.stop="showCommentList(VideoItem.videoId, VideoItem.commentNum)"> -->
	<div  style="text-align: initial;text-align: initial;
	position: absolute;
	bottom: 20px;
	color: white;
	width:100%;
	
	left:10px">
	<input class="input" style="width:100%;background:none;"  readonly :placeholder="'富强、民主、文明、和谐、自由、平等、公正、法治、爱国'" type="text">
	</div>
     
	 <!-- <input class="input"  readonly :placeholder="'富强、民主、文明、和谐、自由、平等、公正、法治、爱国'" type="text"> -->
	 <!-- <span>.....fdsfdsfdsf</span> -->
      <!-- <span class="iconfont icon-at" ></span> -->
      <!-- <span class="iconfont icon-check"></span> -->
    <!-- </div> -->
	<img v-show="!playStatus" class="icon_play"
	     src="@/assets/play.png"/>
		
  </div>
  <!--留言弹窗-->
  <comment ref="comment" @commentNum = "setCommentNum" ></comment>
  <!-- 弹出工具栏 -->
  <van-popup
    v-model="toolShow"
    :overlay-style="{background:'rgba(255,255,255,0)',zIndex:'2000'}"
    round
    position="bottom"
    :style="{ height: '10%',position: 'absolute'}"
  >
  <van-row  justify="space-around" style="padding-top:5%">
    <van-col span="6" @click="fullVideo()">
  		<span >
			<van-icon name="exchange" size="1.5rem" />
			<p style="padding-top:.5rem">全屏</p>
		</span>
	</van-col>
	<van-col span="6" @click.stop="showPageToolMethod">
  				<span>
    		<van-icon name="orders-o" size="1.5rem" />
    		<p style="padding-top:.5rem" v-if="showPageTool" >简约</p>
  		<p style="padding-top:.5rem" v-if="!showPageTool">正常</p>
		
  		</span>
    </van-col>
	<van-col span="6" @click.stop="share">
		<span>
			<van-icon name="share-o" size="1.5rem" />
			<p style="padding-top:.5rem" >分享</p>
		</span>
	</van-col>
	<van-col span="6" @click.stop="update">
		<span>
			<van-icon name="replay" size="1.5rem" />
			<p style="padding-top:.5rem" >刷新</p>
		</span>
	</van-col>
  </van-row>
  </van-popup>
  
  <!-- 分享弹出窗口 -->
  <van-popup
	   round
	  :overlay-style="{background:'rgba(255,255,255,0)',zIndex:'1'}"
  	    v-model="userListView"
  	    position="bottom"
  		@open="openUserView"
		:style="{ height: '65%',position: 'absolute'}"
  	  >
  	  <div style="height:4rem;margin-top:1rem;">
  		  用户
  		  <van-divider />
  	  </div>
  		<div class="detailparent" style="z-index:9999">
  			<div class="van-swipe-cell" style="width: 100%;" v-for="(categoryitem,categoryindex) in userList" @click.stop="shareUser(categoryitem)" :key="categoryindex">
  				<div class="van-swipe-cell__wrapper" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0.6s;">
  					<div class="goods-card van-card" style="border-bottom: 1px solid rgb(235, 237, 240);">
  						<div class="van-card__header">
  							<a class="van-card__thumb">
  								<div class="van-image" style="width: 100%; height: 100%;">
  									<van-image ref="workImage"  lazy-load :src="baseURL + '/common/image?imgId=' + categoryitem.icon +'&token=' + token" style="width:100%;width:45px" v-if="categoryitem.icon"/>
  									<img src="@/assets/default_img.jpg" style="height:40px;width:40px" alt=""  v-if="!categoryitem.icon">
  								</div>
  								<div class="van-info"></div>
  							</a>
  							
  							<div class="van-card__content ">
  								<div>
  									
  									<div class="van-card__title van-multi-ellipsis--l2">
  										{{categoryitem.nickName}}
  									</div>
  									<!-- 在线状态 -->
  									<div class="van-card__desc van-ellipsis " style="top:.2rem">
  										
  										<span v-if="categoryitem.active == 1" style="color:green">在线</span>
  										<span v-if="categoryitem.active != 1">离线</span>
  									</div>
  									
  								</div>
  							</div>
  						</div>
  					</div>
  				</div>
  			</div>
  		</div>
  </van-popup>
  
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
	},
	showPageTool:{
		type:Boolean
	}
  },
  activated(){
	// console.log('显示了.....' + this.index)  
	// console.log(this.curScrollVideo)
	// 找到相同视频
	if(this.curScrollVideo.index == this.index){
		// 判断是否有关注标识,有切换关注状态
		if(this.curScrollVideo.collStatus){
			this.collectionUser = this.curScrollVideo.collStatus
		}
		// 判断视频状态，是否播放视频
		// console.log(this.playStatus)
		if(this.playStatus){
			this.video.play()
		}else{
			this.video.pause()
		}
		
	}
	
	
  },
  beforeDestroy: function () {
	  if(this.video){
			this.video.dispose();
	  }

  
   },
  data () {
    return {
		toolShow:false,// 显示工具
		showIcon:true, // 显示页面图标工具
		touchTime:0,// 长按时间,超过两秒隐藏图标工具
  		commentPop:false,
		user_photo:parseInt(Math.random()*10),// 默认用户图片
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
	  collectionUser:'否', // 收藏
      like: this.VideoItem.collection == '是',
      likeNum: this.VideoItem.likeNum,
  	  video: null,
	  collectionActive:false, // 人员收藏
  	  playStatus:true ,// 播放状态,默认播放
  	  videoProcess:0 ,// 进度条位置
  	  maxVideoProcess: 0, // 当前视频长度
  	  videoProcessInterval:null,
	  videoMessage: null, // 视频滑动进度消息对象
	  upOrDown:false, // 是否上下滑动,用于控制左右滑动失效
	  showFull:false,// 显示全屏按钮
	  userListView:false,// 用户列表显示控制
	  userList:[] // 用户数组
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
	  update(){
		location.reload()
	  },
	  async saveMessage(item){
		  console.log(item)
		  console.log(this.VideoItem)
		  const result = await this.$http.post('/message/addMessage',{
		  	user_id: item.user_id,
		  	message_category:'VIDEO',
		  	message_type:'FORWARD',
			
			// message_photo:this.VideoItem.previewImg, // 图片
		  	message_content:'分享[视频]',
		  	message_source:'USER',
			business_id: this.VideoItem.id // 视频的id
		  })
		  console.log(result)
	  },
	  // 分享用户
	  shareUser(item){
		  // top.a = this.$dialog
		  // 修改层级
		  
		  this.$dialog.confirm({
		    title: '提示',
		    message: '确定分享给' + item.nickName + '吗？'
		  }).then(() => {
			 // console.log('分享中.....')
			 // 保存分享消息
			 this.saveMessage(item)
		  }).catch(() => {
		  	// console.log('不退出')
		  });
		  // 延迟显示
		  setTimeout(()=>{
			  $('.van-dialog').css('z-index','9999')
		  },100)
	  },
	  // 打开用户列表窗口
	  async openUserView(){
		  const res = await this.$http.get('/admin/queryNotCurUserInfo')
		  console.log(res)
		  if(res.data.code == 200){
			  this.userList = res.data.data
		  }
	  },
	  // 分享视频
	  share(){
		  this.toolShow = false;
		  this.userListView = true
	  },
	  // 全屏
	  fullVideo(){
		  this.toolShow = false
		  this.screen()
	  },
			// 隐藏视频和工具栏外所有东西
			showPageToolMethod(){
				// console.log('触发......')
				this.toolShow = false
				// this.showPageTool = !this.showPageTool
				this.$emit('showPageToolMethod',this.showPageTool)
			},
	  toUserVideo(item){
		  // 跳转前记录当前视频信息
		  this.curScrollVideo.index = this.index
		  
		this.$router.push('/videoUserInfo/' + item.personId + '/SEX/video')
	  },
	 // 收藏人员
	 // collectionUserData(item){
		//  console.log(item)
	 // },
	 //收藏人员
	 async collectionPersonClick(item) {
	    if(localStorage.getItem('token')){
	      // 判断显示状态,是收藏还是取消收藏
	      if(!this.collectionActive){
	        const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:item.personId,collectionType:'2'})
	        // console.log(res)
	        if(res.data.data == '收藏成功'){
	            // this.collectionActive = true
				this.collectionUser = '是'
	        }else{
	            // this.collectionActive = false
	            this.$msg.fail(res.data.message)
	        }
	      } else {
	        const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:item.personId,collectionType:'2'})
	        if(res.data.data == '取消成功'){
	          this.collectionUser = '否'
			  // this.collectionActive = false
	        } else {
	           this.$msg.fail(res.data.message)
	        }
	      }
	 
	         // this.$msg.fail(res.data.msg)
	    }
	 },
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
		  video.currentTime = this.videoMessage ? this.videoMessage.curNum : 0
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
	  },
	  createVideo(index){
		this.$nextTick(()=>{
				  let curIndex = this.index
				  if(this.VideoItem.videoType == 'm3u8'){
					  let _this = this
				  	  this.video = this.$video(
								this.getVideoHtml(),
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
									// 视频加载完成
									this.on('canplaythrough',function(){
										// 添加手势缩放监听

									})
				  	  		  }
				  	          );
				  	  let nextAddress = this.VideoItem.nextAddress
				  	  nextAddress = nextAddress.split('_-')[1]
				  	  this.video.src({
				  	  		  src:this.baseURL + '/webInfoVideo/' + nextAddress + '/' + nextAddress + '?token=' + this.token,
				  	  		  type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
				  	  		})
					 if(curIndex == this.index){
						this.video.play()
						 // 加载收藏和评论数量
						this.stopProcess()
						this.startProcess();
					 }
				     this.loadCommentAndCollectionNum(); // 加载评论收藏信息
				  }
				  if(this.VideoItem.videoType == 'mp4'){
					  let _this = this
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
					  					this.el_.getElementsByTagName('span')[0].innerText = ''
					  				})
					  									// 视频加载完成
					  									this.on('canplaythrough',function(){
					  										// 添加手势缩放监听
					  										console.log(this)
					  										
					  									})
					  		  }
					          );
						  this.video.src({
								  src:this.baseURL + '/video/' + _this.VideoItem.fileDir + '?token=' + this.token,
								  // type: 'application/x-mpegURL' //在重新添加视频源的时候需要给新的type的值
								})
							if(curIndex == this.index){
								 this.video.play()
								 // 加载收藏和评论数量
								 this.loadCommentAndCollectionNum();
								this.stopProcess()
								this.startProcess();
									
							}
				  }
		})  
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
	  // 打开工具栏
	  openTools(item){
		this.toolShow = true  
	  },
	 //  //弹出评论窗口
	  changeComment() {
		  // 暂停当前视频
		  this.$refs.comment.commentPop = true
		  this.$refs.comment.videoComment = [];
		  this.$refs.comment.commentNum = this.collNum;
		  this.$refs.comment.getComment(this.getVideo())
	  },
	  setCommentNum(obj,num){
			this.commentNum = num
	  },
	  //记录播放进度
	  changeProcess() {
		  let video = this.getVideo()
		  if(video){
			  let currentTime = video.currentTime.toFixed(1);
			  let duration = video.duration.toFixed(1);
			  this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100)
		  }
	  },
	  // 开始计时
	startProcess(){
		this.maxVideoProcess = this.getVideo().currentTime // 记录当前视频长度
		this.videoProcessInterval = setInterval(() => {
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
		const res = await this.$http.get('/comment/queryCommentNumByWorkId?workId=' + this.VideoItem.id + "&collectionType=1")
		// console.log(res)
		// console.log(res)
		if(res.data){
			this.commentNum = res.data.commentNum
			this.collNum = res.data.collNum
			this.collectionUser = res.data.collectionUser
		}

	},
	  // 开始拖动,暂停播放
		dragStart(e){
			clearInterval(this.videoProcessInterval)
			this.video.pause()
			this.playStatus = false
		},
		// 结束拖动
		dragEnd(e){
			// console.log('结束拖动')
		},
		// 进度条变化触发,用于获取位置，显示当前时间
		dragInput(value){
			// console.log(value)
			clearInterval(this.videoProcessInterval)
		},
		// 进度条变化,且结束时候触发,用于加载当前位置视频
		dragChange(value){
			// alert(value)

			// let duration = document.querySelectorAll('video')[this.current].duration.toFixed(0);
			let video = this.getVideo()
			// console.log('拖动结束位置' + value)
			this.videoProcess = value
			video.currentTime = parseInt((video.duration * (value/100)).toFixed(2))
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
	  		  const res = await this.$http.post('/collection/deleteCollection/',{webInfoDetailDataId:this.VideoItem.id,collectionType:'1'})
	  		  if(res.data.data == '取消成功'){
	  			// this.videoList[this.current].fabulous = false
				this.like = !this.like
	  		  } else {
	  			 this.$msg.fail(res.data.message)
	  		  }
	       } else {
	  		 const res = await this.$http.post('/collection/addCollection/',{webInfoDetailDataId:this.VideoItem.id,collectionType:'1'})
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
		// 延迟0.3秒如果clickFlag还是false说明是单击
		// console.log('触发....' + this.$refs.comment.commentPop)
		// 如果打开了评论窗口,点击失效
		if(this.$refs.comment.commentPop){
			return;
		}
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

<style  lang='stylus' scoped>
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
    .comment1
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
	
/deep/ .van-card__thumb img{
	border-radius:30px;
}

/deep/ .van-swipe-cell{
	height:4rem;
}

/deep/ .van-card__thumb{
	position: relative;
	    flex: none;
	    width: 40px;
	    height: 88px;
	    margin-right: 8px;
}

/deep/ .van-card__content{
	height:4rem;
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

</style>
